const express = require("express");
const app = express();
const connectDb = require("./config/connect");
const cors = require("cors");
const router = require("./routes/route");
const errorHandler = require("./middleware/asyncHandler");
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

// Socket.io middleware for authentication
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("No Token provided"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return next(new Error("User not found"));
        }
        socket.user = user; // Attach user to socket
        next();
    } catch (error) {
        return next(new Error(`Authentication error: ${error.message}`));
    }
});

// Socket.io connections
io.on("connection", (socket) => {
    console.log("New User connected:", socket.id, "username:", socket.user.name);
    let currentRoomId = null;

    // Join room event
    socket.on("joinRoom", async ({ roomId }) => {
        try {
            const room = await Room.findById(roomId)
                .populate({
                    path: "messages",
                    populate: { path: "sentBy", select: "name" },
                })
                .populate("versions.updatedBy", "name");

            if (!room) {
                return socket.emit("error", { message: "Room not found" });
            }

            currentRoomId = roomId;
            socket.join(roomId);
            console.log(`User ${socket.user.name} joined room ${roomId}`);

            socket.emit("roomData", {
                codeContent: room.code,
                language: room.language,
                messages: room.messages,
                versions: room.versions,
            });
            socket.to(roomId).emit("userJoined", { username: socket.user.name });
        } catch (error) {
            console.error(`Error joining room: ${error.message}`);
            socket.emit("error", { message: "Error occurred while joining room" });
        }
    });
    
    // change langugage 
    socket.on("changeLanguage", async ({ language }) => {
        if (!currentRoomId) {
            return socket.emit("error", { message: "You need to join a room first" });
        }
    
        try {
            const room = await Room.findById(currentRoomId);
            if (!room) {
                return socket.emit("error", { message: "Room not found" });
            }
            room.language = language;
            await room.save();
            socket.to(currentRoomId).emit("languageChanged", { language });
            socket.emit("languageChanged", { language });
        } catch (error) {
            console.error(`Error changing language: ${error.message}`);
            socket.emit("error", { message: "Failed to change language" });
        }
    });

    // Handle code change
    socket.on("codeChange", async (newCode) => {
        if (!currentRoomId) {
            return socket.emit("error", { message: "You need to join a room first" });
        }

        try {
            const room = await Room.findById(currentRoomId);
            if (!room) {
                return socket.emit("error", { message: "Room not found" });
            }
            
            room.updatedAt = Date.now();
            room.versions.push({
                codeContent: newCode,
                language: room.language,
                updatedBy: socket.user._id,
            });
            await room.save();
            socket.to(currentRoomId).emit("codeUpdate", newCode);
        } catch (error) {
            console.error(`Error updating code: ${error.message}`);
            socket.emit("error", { message: "Failed to update code" });
        }
    });

    // Handle chat message
    socket.on("chatMessage", async (message) => {
        if (!currentRoomId) {
            return socket.emit("error", { message: "You need to join a room first" });
        }

        try {
            const newMessage = new Message({
                roomId: currentRoomId,
                message: message,
                sentBy: socket.user._id,
            });
            await newMessage.save();
            await newMessage.populate("sentBy", "name");

            const room = await Room.findById(currentRoomId);
            if (room) {
                room.messages.push(newMessage._id);
                await room.save();
                socket.to(currentRoomId).emit("updatedMessage", newMessage);
            }
        } catch (error) {
            console.error(`Error sending message: ${error.message}`);
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    // Compile code event
    socket.on("compileCode", async ({ code, language }, callback) => {
        try {
            // Simulating compilation
            const output = "Compiled successfully"; // Here you can add real compilation logic
            callback({ success: true, message: output });
        } catch (error) {
            console.error(`Failed to compile: ${error.message}`);
            callback({ success: false, message: "Failed to compile" });
        }
    });

    // Leave room event
    socket.on("leaveRoom", () => {
        if (currentRoomId) {
            socket.leave(currentRoomId);
            console.log(`${socket.user.name} left the room`);
            socket.to(currentRoomId).emit("leftRoom", { username: socket.user.name });
            currentRoomId = null; // Clear the current room
        }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log(`${socket.user.name} disconnected`);
        if (currentRoomId) {
            socket.to(currentRoomId).emit("userDisconnect", { username: socket.user.name });
        }
    });
});

// Start server
const port = process.env.PORT || 5000;
server.listen(port, async () => {
    try {
        await connectDb();
        console.log("Server running on port", port);
    } catch (error) {
        console.error(`Failed to load server: ${error.message}`);
    }
});
