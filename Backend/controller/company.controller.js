import User1 from "../model/company.model.js";
import bcryptjs from "bcryptjs";

export const signup1 = async (req, res) => {
  try {
    const { company_name, company_email, company_address, password } = req.body;
    const user1 = await User1.findOne({ company_email });
    if (user1) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcryptjs.hash(password, 8);
    const createdUser1 = new User1({
      company_name,
      company_email,
      company_address,
      password: hashPassword,
    });
    await createdUser1.save();
    res.status(201).json({ message: "User created successfully", company_name });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login1 = async (req, res) => {
  try {
    const { company_name, company_email, password } = req.body;
    const user1 = await User1.findOne({ company_email });
    if (!user1) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user1.company_name !== company_name) {
      return res.status(400).json({ message: "Invalid company name" });
    }

    const isMatch = await bcryptjs.compare(password, user1.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user1: {
        _id: user1._id,
        company_name: user1.company_name,
        company_email: user1.company_email,
        company_address: user1.company_address,
      },
    });
  } catch (error) {
    console.log("Error:" + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanyDetails1 = async (req, res) => {
  try {
    const { company_name, company_email, company_address } = req.query;
    const query = {};

    if (company_name) query.company_name = company_name;
    if (company_email) query.company_email = company_email;
    if (company_address) query.company_address = company_address;
    const companies = await User1.find(query);
    if (companies.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(companies);
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanyDetails = async (req, res) => {
  try {
    const { company_email } = req.query;


    // Check if company_email is provided
    if (!company_email) {
      return res.status(400).json({ message: "company_email is required" });
    }


    const company = await User1.findOne({ company_email });
   
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
   
    // Respond with company details
    res.status(200).json({
      company_email: company.company_email,
      company_address: company.company_address,
      company_name: company.company_name,
    });
   
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};





