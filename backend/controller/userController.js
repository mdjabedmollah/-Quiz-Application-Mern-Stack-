import mongoose from "mongoose";
import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const TOKEN_EXPIRED_IN = "24h";
import "dotenv/config";

const jwt_scret = process.env.JWT_SCRET;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
    const exist = await User.findOne({ email }).lean();
    if (exist) {
      return res.status(409).json({
        success: false,
        message: "User is already exist ",
      });
    }
    const newId = new mongoose.Types.ObjectId();
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({
      _id: newId,

      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    if (!jwt_scret) throw Error("jwt_scret is not found on server");

    const Token = jwt.sign({id: newId.toString() }, jwt_scret, {
      expiresIn: TOKEN_EXPIRED_IN,
    });
    
    return res.status(201).json({
        success:true,
        message:"Account created succeesfully",
        Token,
        User:{
            id:newUser._id.toString(),
            name:newUser.name,
            email:newUser.email
        }
    })

  } catch (error) {
    console.log("Register error")
    return res.status(500).json({
    
      success: false,
      message:"Server error"
    });
  }
};
export const login=async(req,res)=>{
   try {
     const {email,password}=req.body;
     if ( !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }
    const user= await User.findOne({email});
    if(!user){
        return res.status(400).json({
        success: false,
        message: "Invalid email or password ",
      });
    }

    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
       return res.status(401).json({
        success: false,
        message: "Invalid email or password ",
      });
    }
    const Token = jwt.sign({ _id: user._id }, jwt_scret, {
      expiresIn: TOKEN_EXPIRED_IN,
    });
    
    return res.status(201).json({
        success:true,
        message:"Account created succeesfully",
        Token,
        User:{
            id:user._id.toString(),
             name:user.name,
            email:user.email
        }
    })
   } catch (error) {
    console.log("login error ")
    return res.status(500).json({
    
      success: false,
      message:"Server error"
    });
   }
}