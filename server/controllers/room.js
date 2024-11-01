const { StatusCodes } = require('http-status-codes');
const Room = require('../models/roomSchema')
const {v4:uuidv4} = require('uuid');
const Message = require('../models/messageSchema');
const createRoom = async(req, res)=>{
    const {code} = req.body

    const roomId = uuidv4();
    
    const newRoom = new Room({
        roomId:roomId,
        createdBy:req.user.userId,
        versions:[{
            codeContent:'write your code here',
            updatedBy:req.user.userId
        }]
        ,
        users:[req.user.userId]
    })
    await newRoom.save();
    res.status(StatusCodes.OK).json({message:'room created successfully', roomId})
}

const joinRoom = async(req, res)=>{
    const {roomId} = req.params
    const {code} = req.body
    if(!roomId || !code) return res.status(StatusCodes.BAD_REQUEST).send("provide all details")
    const room = await Room.findOne({roomId})
    if(!room) return res.status(StatusCodes.NOT_FOUND).send("room not found");
    if(!code==room.code){
        return res.status(StatusCodes.BAD_REQUEST).json({message:'wrong password'})
    }
    if(!room.users.includes(req.user.userId)){
        room.users.push(req.user.userId);
        await room.save();
        res.status(StatusCodes.OK).json({message:"joined successfully"})
    }
}
const leaveRoom = async(req, res)=>{
    const {roomId} = req.params
    const room = await Room.findOne({roomId})
    if(!room){
        return res.status(StatusCodes.NOT_FOUND).send("room not found")
    }
    room.users = room.users.filter(userId=>userId.toString() != req.user.userId.toString())
    await room.save();
    return res.status(StatusCodes.OK).json({message:"left the room successfully"})
}
// fetches all room message of specific user
const userRoom = async(req, res)=>{
    const rooms = await Room.find({users:req.user.userId}).populate('messages').sort({updatedAt:-1})
    if(!rooms ){
        res.status(StatusCodes.NOT_FOUND).json({message:"join any room first"})
    }
    return res.status(StatusCodes.OK).json({rooms})
}
module.exports = {createRoom, joinRoom, leaveRoom, userRoom}