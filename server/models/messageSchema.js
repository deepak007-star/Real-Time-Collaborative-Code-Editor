const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    roomId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Room',
        required:true,
    },
    message:{
        type:String,
    },
    sentBy:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true
    },
    timeStamp:{
        type:Date,
        default:Date.now,
    }
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;