import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Generate JWT token
const generateToekn = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

//@desc register new user
//@route POST /api/auth/register
//@access public
export const register=async(req,res,next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
}

//@desc log user
//@route GET /api/auth/login
//@access public

export const login=async(req,res,next)=>{
    
}
//@desc Get user profile
//@route POST /api/auth/profile
//@access private

export const getProfile=async(req,res,next)=>{

}
//@desc update user profile
//@route PUT /api/auth/profile
//@access Private

export const updateProfile=async(req,res,next)=>{

}
//@desc change password
//@route PUT /api/auth/change-password
//@access Private

export const changePassword=async(req,res,next)=>{
    
}
