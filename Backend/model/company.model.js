import mongoose from "mongoose";
const user1Schema= new mongoose.Schema({
    company_name:{
        type:String,
        required:true
    },
    company_email:{
        type:String,
        required:true,
        unique:true
    },

company_address:{
    type:String,
    required:true,

},
    password:{
        type:String,
        required:true
    },
    
})
const User1=mongoose.model("User1",user1Schema);
export default User1;