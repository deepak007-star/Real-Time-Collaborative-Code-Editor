const { StatusCodes } = require("http-status-codes");
const Message = require("../models/messageSchema")

// const sendMessage = async(req, res)=>{
//     const {roomId, message} = req.body
//     const newMessage = new Message({
//         roomId:roomId,
//         sentBy:req.user.userId,
//         message:message                                                                 
//     })
//     await newMessage.save();
//     return res.status(StatusCodes.OK).json({newMessage})
// }
// const getMessage = async(req, res)=>{
//     const {roomId} = req.params
//     if(!roomId){
//         return res.status(StatusCodes.NOT_FOUND).send("room not found")
//     }
//     const messages = await Message.findOne({roomId:roomId}).populate('User','name').sort({createdAt:-1})
//     return res.json(messages);
// }

// module.exports = {sendMessage, getMessage}