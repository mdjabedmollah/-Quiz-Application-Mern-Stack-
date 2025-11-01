import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import 'dotenv/config'
const jwt_secret=process.env.JWT_SCRET;

export const authMeddleware=async(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader  || authHeader.starsWith('Bearer ')){
     return res.status(401).json({
        success:false,
        message:'Not authorized , token missing'
     })
    }
    const token =authHeader.split(' ')[1]
    //verify
    try {
        const payload=jwt.verify(token,jwt_secret);
        const user=await User.findById(payload.id).select('-password')
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"

            })
        }
        req.user=user;
        next()
    } catch (error) {
        console.log("JWT verification failed",error)
        return res.status(401).json({
            success:false,
            message:"token invalid or expored"
        })
    }
}