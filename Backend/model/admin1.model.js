import mongoose from "mongoose";
const user2Schema= new mongoose.Schema({
    admin_name:{
        type:String,
        required:true
    },
    admin_email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    
})
const User2=mongoose.model("User2",user2Schema);
export default User2;