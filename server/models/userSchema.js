const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "username required"],
    },
    email: {
      type:String, 
      unique: true,
      required: [true, "email required"],
    },
    password: {
      type: String,
      required: [true, "password required"],
    },
  },
  {
    Timestamp: true,
  }
);

userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10)
  next();
})
userSchema.methods.comparePass = async function(password){
    return await bcrypt.compare(password, this.password);
}
const User = mongoose.model('User',userSchema)
module.exports = User;