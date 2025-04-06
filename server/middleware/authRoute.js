const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const authentication = (req, res, next)=>{    
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:"authentication invalid"})
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT) 
        req.user = {userId:payload.userId, name:payload.name}
        next()  
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("authentication failed")
    }
    
}
module.exports = authentication;