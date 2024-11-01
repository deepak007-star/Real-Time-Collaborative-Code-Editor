const mongoose = require('mongoose')
require('dotenv').config()

const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB)
        console.log("connected to database");
        
    } catch (error) {
        console.log(`Failed to connect to database, issue:${error.message}`);
    }
}
module.exports = connectDb;