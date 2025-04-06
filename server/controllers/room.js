const { StatusCodes } = require("http-status-codes");
const Room = require("../models/roomSchema");
const { v4: uuidv4 } = require("uuid");
const Message = require("../models/messageSchema");
const { STATUS_CODES } = require("http");

const createRoom = async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .json({ message: "password not filled" });
  }
  const roomId = uuidv4();

  const newRoom = new Room({
    roomId: roomId,
    code: password,
    createdBy: req.user.userId,
    versions: [
      {
        codeContent: "write your code here",
        updatedBy: req.user.userId,
      },
    ],
    users: [
      {
        user: req.user.userId,
        joinedAt: new Date(),
      },
    ],
  });
  await newRoom.save();
  res
    .status(StatusCodes.OK)
    .json({ message: "room created successfully", roomId });
};

const joinRoom = async (req, res) => {
  const { roomId } = req.params;
  const { code } = req.body;
  if (!roomId || !code)
    return res.status(StatusCodes.BAD_REQUEST).send("provide all details");
  const room = await Room.findOne({ roomId });
  if (!room) return res.status(StatusCodes.NOT_FOUND).send("room not found");
  if (!code == room.code) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "wrong password" });
  }
  const existing = room.users.find((user) => user.user === req.user.userId);
  if (!existing) {
    room.users.push({ user: req.user.userId, joindedAt: new Date() });
    await room.save();
    res.status(StatusCodes.OK).json({ message: "joined successfully", room });
  }
};

const leaveRoom = async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findOne({ roomId });
  if (!room) {
    return res.status(StatusCodes.NOT_FOUND).send("room not found");
  }
  room.users = room.users.filter(
    (user) => user.user.toString() !== req.user.userId.toString()
  );
  await room.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: "left the room successfully" });
};
// fetches all room message of specific user
const userRoom = async (req, res) => {
  const rooms = await Room.find({ users: req.user.userId })
    .populate("messages")
    .populate({ path: "createdBy", select: "name" })
    .populate({ path: "users.user", select: "name" })
    .sort({ updatedAt: -1 });
  if (!rooms.length) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "join any room first" });
  }
  return res.status(StatusCodes.OK).json({ success:true, rooms });
};

const roomDetails = async (req, res) => {
  const { id } = req.params;
  const room = await Room.findOne({ roomId:id })
    .populate("messages")
    .populate({ path: "createdBy", select: "name" })
    .populate({ path: "users.user", select: "name" })
  if (!room) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "room not found" });
  }
  return res.status(StatusCodes.OK).json({success:true, room})
};
module.exports = { createRoom, joinRoom, leaveRoom, userRoom, roomDetails };
