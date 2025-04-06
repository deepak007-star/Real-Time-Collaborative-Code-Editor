const express = require("express");
const app = express();
const connectDb = require("./config/connect");
const cors = require("cors");
const router = require("./routes/route");
const errorHandler = require("./middleware/errorHandler")
const notFound = require("./middleware/notFound");
const { Server } = require("socket.io");
const { createServer } = require("http");
const Room = require("./models/roomSchema");
const Message = require("./models/messageSchema");
const User = require("./models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// All middlewares
app.use(express.json());
app.use(cors());
app.use("/api", router);
app.get("/", (req, res) => {
  res.send("Hello Express");
});
app.use(errorHandler);
app.use(notFound);

// HTTP server and Socket.io instance
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Constants
const BATCH_INTERVAL = 5000; // 5 seconds
const MAX_CACHE_SIZE = 1000; // Maximum messages to store in cache
const MAX_VERSION_HISTORY = 50; // Maximum code versions to keep per room

// Global caches
const chatMessageCache = new Map();
const lastSavedTime = new Map();
const activeRooms = new Set(); // Track active rooms for cleanup

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("No token provided"));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return next(new Error("User not found"));
    }
    
    socket.user = user; // Attach user to socket
    socket.rooms = new Set(); // Track rooms this socket has joined
    next();
  } catch (error) {
    return next(new Error(`Authentication error: ${error.message}`));
  }
});

// Batch save messages to database
async function saveCachedMessages() {
  if (chatMessageCache.size === 0) return;
  
  const roomsToProcess = [...chatMessageCache.keys()];
  
  for (const roomId of roomsToProcess) {
    const messages = chatMessageCache.get(roomId);
    if (!messages || messages.length === 0) continue;
    
    try {
      // Insert all messages for this room in one batch operation
      const savedMessages = await Message.insertMany(messages);
      
      // Update room with all new message IDs at once
      if (savedMessages.length > 0) {
        const messageIds = savedMessages.map(msg => msg._id);
        await Room.findByIdAndUpdate(roomId, {
          $push: { messages: { $each: messageIds } }
        });
      }
      
      // Clear the cache for this room
      chatMessageCache.set(roomId, []);
    } catch (error) {
      console.error(`Failed to save messages for room ${roomId}: ${error.message}`);
    }
  }
}

// Periodically save messages
setInterval(saveCachedMessages, BATCH_INTERVAL);

// Cleanup stale data from caches every hour
setInterval(() => {
  // Clean up inactive rooms from caches
  for (const roomId of lastSavedTime.keys()) {
    if (!activeRooms.has(roomId)) {
      lastSavedTime.delete(roomId);
      chatMessageCache.delete(roomId);
    }
  }
  
  // Force save any pending messages
  saveCachedMessages();
}, 3600000); // Every hour

// Socket.io connections
io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}, username: ${socket.user.name}`);

  // Track user's current room
  let currentRoomId = null;

  // Join room event
  socket.on("joinRoom", async (roomId) => {
    try {
      // Leave current room if any
      if (currentRoomId) {
        await handleLeaveRoom();
      }

      // Join new room
      socket.join(roomId);
      currentRoomId = roomId;
      activeRooms.add(roomId);
      
      // Initialize caches for this room if needed
      if (!chatMessageCache.has(roomId)) {
        chatMessageCache.set(roomId, []);
      }
      
      console.log(`${socket.user.name} joined room ${roomId}`);
      socket.to(roomId).emit("userJoined", { 
        username: socket.user.name, 
        userId: socket.user._id 
      });
      
      // Get room details to sync with the client
      const room = await Room.findById(roomId);
      if (room) {
        // Send the latest code and language to the joining user
        socket.emit("roomState", {
          language: room.language,
          code: room.versions.length > 0 ? room.versions[room.versions.length - 1].codeContent : "",
          activeUsers: getActiveUsersInRoom(roomId)
        });
      }
    } catch (error) {
      console.error(`Error joining room: ${error.message}`);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Handle code changes
  socket.on("codeChange", async (roomId, code) => {
    try {
      if (roomId !== currentRoomId) {
        return socket.emit("error", { message: "Not in the specified room" });
      }
      
      // Broadcast to others in the room
      socket.to(roomId).emit("codeUpdate", code);
      
      // Check if it's time to save a new version
      const lastSaved = lastSavedTime.get(roomId) || 0;
      if (Date.now() - lastSaved > BATCH_INTERVAL) {
        const room = await Room.findById(roomId);
        if (!room) {
          return socket.emit("error", { message: "Room not found" });
        }
        
        // Create new version
        const version = {
          codeContent: code,
          updatedBy: socket.user._id,
          updatedAt: new Date()
        };
        
        // Maintain maximum version history
        if (room.versions.length >= MAX_VERSION_HISTORY) {
          // Remove oldest versions, keeping MAX_VERSION_HISTORY
          room.versions = room.versions.slice(-MAX_VERSION_HISTORY + 1);
        }
        
        room.versions.push(version);
        room.updatedAt = new Date();
        await room.save();
        
        lastSavedTime.set(roomId, Date.now());
      }
    } catch (error) {
      console.error(`Error handling code change: ${error.message}`);
      socket.emit("error", { message: "Failed to save code" });
    }
  });

  // Change language
  socket.on("changeLanguage", async ({ roomId, language }) => {
    try {
      if (roomId !== currentRoomId) {
        return socket.emit("error", { message: "Not in the specified room" });
      }
      
      const room = await Room.findById(roomId);
      if (!room) {
        return socket.emit("error", { message: "Room not found" });
      }
      
      // Update language and reset code if language changes
      if (room.language !== language) {
        room.language = language;
        
        // Create an initial empty version for the new language
        const initialVersion = {
          codeContent: "",
          updatedBy: socket.user._id,
          updatedAt: new Date()
        };
        
        room.versions = [initialVersion];
        await room.save();
        
        // Notify all users in the room
        io.to(roomId).emit("languageChanged", { 
          language,
          code: "" // Reset code when language changes
        });
      }
    } catch (error) {
      console.error(`Error changing language: ${error.message}`);
      socket.emit("error", { message: "Failed to change language" });
    }
  });

  // Handle chat messages
  socket.on("chatMessage", ({ roomId, message }) => {
    try {
      if (!roomId || roomId !== currentRoomId) {
        return socket.emit("error", { message: "Join a room first" });
      }
      
      const newMessage = {
        roomId,
        message,
        sentBy: socket.user._id,
        timestamp: new Date()
      };
      
      // Broadcast to room members
      socket.to(roomId).emit("newMessage", {
        ...newMessage,
        username: socket.user.name
      });
      
      // Cache for batch saving
      if (!chatMessageCache.has(roomId)) {
        chatMessageCache.set(roomId, []);
      }
      
      const messages = chatMessageCache.get(roomId);
      messages.push(newMessage);
      
      // If cache is getting too large, force a save
      if (messages.length >= MAX_CACHE_SIZE) {
        saveCachedMessages();
      }
    } catch (error) {
      console.error(`Error sending chat message: ${error.message}`);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Compile code event
  socket.on("compileCode", async ({ code, language }, callback) => {
    try {
      // This is a placeholder for actual compilation logic
      // You could integrate with a compilation service here
      
      // Example mock compilation response
      setTimeout(() => {
        const output = "Compiled successfully"; // Mock response
        callback({ success: true, output });
      }, 500); // Simulate processing time
    } catch (error) {
      console.error(`Compilation error: ${error.message}`);
      callback({ 
        success: false, 
        output: `Failed to compile: ${error.message}` 
      });
    }
  });

  // Handle leave room
  async function handleLeaveRoom() {
    if (currentRoomId) {
      socket.leave(currentRoomId);
      
      // Notify others in the room
      socket.to(currentRoomId).emit("userLeft", { 
        username: socket.user.name,
        userId: socket.user._id
      });
      
      console.log(`${socket.user.name} left room ${currentRoomId}`);
      
      // Check if room is now empty and update activeRooms
      const roomMembers = io.sockets.adapter.rooms.get(currentRoomId);
      if (!roomMembers || roomMembers.size === 0) {
        activeRooms.delete(currentRoomId);
        
        // Force save any pending messages for this room
        if (chatMessageCache.has(currentRoomId) && 
            chatMessageCache.get(currentRoomId).length > 0) {
          saveCachedMessages();
        }
      }
      
      currentRoomId = null;
    }
  }

  // Leave room event
  socket.on("leaveRoom", handleLeaveRoom);

  // Handle user disconnect
  socket.on("disconnect", async () => {
    console.log(`${socket.user.name} disconnected`);
    await handleLeaveRoom();
  });

  // Helper function to get active users in a room
  function getActiveUsersInRoom(roomId) {
    const users = [];
    const roomSockets = io.sockets.adapter.rooms.get(roomId);
    
    if (roomSockets) {
      for (const socketId of roomSockets) {
        const clientSocket = io.sockets.sockets.get(socketId);
        if (clientSocket && clientSocket.user) {
          users.push({
            id: clientSocket.user._id,
            name: clientSocket.user.name
          });
        }
      }
    }
    
    return users;
  }
});

// Start server
const port = process.env.PORT || 5000;
server.listen(port, async () => {
  try {
    await connectDb();
    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1); // Exit on critical error
  }
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  // Save any cached messages before shutting down
  await saveCachedMessages();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  // Save any cached messages before shutting down
  await saveCachedMessages();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});