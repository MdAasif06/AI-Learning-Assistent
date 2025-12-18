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
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //check user if exits
    const userExists = await User.findOne({ $or: [{ email }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error:
          userExists.email === email
            ? "Email alredy register"
            : "username alredy taken",
        statusCode: 400,
      });
    }

    //create user
    const user = await User.create({
      username,
      email,
      password,
    });
    //generate Token
    const token = generateToekn(user._id);
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token,
      },
      message: "user generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc log user
//@route GET /api/auth/login
//@access public

export const login = async (req, res, next) => {
  try {
    const { email,password }= req.body;

    //validate input
    if(!email || !password){
      return res.status(400).json({
        success:false,
        error:"please provide email and passsword",
        statusCode:400
      })
    }
    //check for user (include password for comparison)
    const user = await User.findOne({email}).select("+password");
    // console.log(user)
    if(!user){
      return res.status(401).json({
        success:false,
        error:"Invalid credendial one",
        statusCode:401

      })
    }
    //check password
    const isMatched=await user.matchPassword(password)
    if(!isMatched){
      return res.status(401).json({
        success:false,
        error:"Invalid Credendial two",
        statusCode:401
      })
    }
    //Generate Token
    const token=generateToekn(user._id)

    res.status(200).json({
      success:true,
      user:{
        id:user._id,
        username:user.username,
        email:user.email,
        profileImage:user.profileImage
      },
      token,
      message:"login successfully"
    })

  } catch (error) {
    next(error)
  }
};
//@desc Get user profile
//@route POST /api/auth/profile
//@access private

export const getProfile = async (req, res, next) => {};
//@desc update user profile
//@route PUT /api/auth/profile
//@access Private

export const updateProfile = async (req, res, next) => {};
//@desc change password
//@route PUT /api/auth/change-password
//@access Private

export const changePassword = async (req, res, next) => {};
