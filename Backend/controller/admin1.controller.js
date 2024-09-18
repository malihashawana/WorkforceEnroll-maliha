import User2 from "../model/admin1.model.js";
import bcryptjs from "bcryptjs";
export const signup2=async(req,res)=>{
    try{
        const {admin_name,admin_email,password }=req.body;
        const user2= await User2.findOne({admin_email});
        if(user2){
            return res.status(400).json({message:"User already exists"})
        }
        const hashPassword= await bcryptjs.hash(password,8)
        const createdUser1=new User2({
            admin_name:admin_name,
            admin_email:admin_email,           
            password:hashPassword,
        })
        await createdUser1.save()
        res.status(201).json({message:"User created successfully"})

    }catch(error){
        console.log("Error: " + error.message);
        res.status(500).json({message:"Internal server error"});

    }
};
export const login2=async(req,res)=>{
    try{
        const {admin_email, password,admin_name} = req.body;

        const user2 = await User2.findOne({ admin_email });
        
        if (!user2) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Checking if the company names match
        if (user2.admin_name !== admin_name) {
            return res.status(400).json({ message: "Invalid company name" });
        }

        const isMatch = await bcryptjs.compare(password, user2.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful",
            user2: {
                _id: user2._id,
                admin_name: user2.admin_name,
                admin_email: user2.admin_email,
            },
        });







        {/*const {company_email,password}=req.body;
        
        const user1=await User1.findOne({company_email});
        const isMatch=await bcryptjs.compare(password,user1.password)
        if(!user1|| !isMatch){
            return res.status(400).json({message:"Invalid email or password"});

        }else{
            res.status(200).json({message:"Login successful",user1:{
                _id:user1._id,
                company_name:user1.company_name,
                company_email:user1.company_email


        }})
        }}*/}
    }catch(error){
        console.log("Error:"+error.message)
        res.status(500).json({message:"Internal server error"});
    }
}
