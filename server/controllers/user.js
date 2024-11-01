const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {StatusCodes} = require('http-status-codes')
require('dotenv').config();
const register = async(req, res)=>{
    try {
        const {name, email, password}= req.body;
    const existing = await User.findOne({email})
    if(existing){
        return res.status(StatusCodes.BAD_REQUEST).send('user already exists')
    }
    // if(!name || !email ||!password){
    //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("fill all details")
    // }
    const user = await User.create({name, email, password})
    if(!user){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("failed!")
    }
    await user.save();
    res.status(StatusCodes.OK).json({message:`registered successfully`});
    } catch (error) {
        console.log(`failed to register ${error.message}`);
    }
    
}

const login = async(req, res)=>{
    const {email, password} = req.body;
    if(email && password){
        const user = await User.findOne({email})
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).send("user not found")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(StatusCodes.BAD_REQUEST).send("wrong password")
        }
        const token = jwt.sign({userId:user._id},process.env.JWT, {expiresIn:'1h'});
        res.json({token})
    }else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"failed to login"})
    }
}
module.exports = {register, login};