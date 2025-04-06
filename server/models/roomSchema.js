const mongoose = require('mongoose')

const versionSchema = mongoose.Schema({
    codeContent:{
        type:String, 
        required:true,
    },
    updatedBy:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true,
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})

const statusSchema = mongoose.Schema({
    users:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User', 
    },
    isActive:{
        type:Boolean, 
        default:true,
    },
    joinedAt:{
        type:Date,
        default:Date.now
    }
})
const roomSchema =mongoose.Schema({
    roomId:{
        type:String, 
        unique:true,
    },
    code:{
        type:String, 
        required:true,
    },
    language:{
        type:String, 
        default:'C++'
    },
    users:[statusSchema],
    createdBy:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true,
    },
    messages:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Message',
    }],
    versions:[versionSchema] 
},{timestamps:true})

const Room = mongoose.model('Room', roomSchema)
module.exports = Room;