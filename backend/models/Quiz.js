import mongoose from "mongoose";

const quizSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    documentId:{
        type:mongoose.Schema.ObjectId,
        ref:"Document",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    questions:[
    {
        question:{
            type:String,
            required:true
        },
        options:{
            type:[String],
            required:true,
            validate:[array=>array.length === 4,"Must have exactly 4 option"]
        },
        correctAnswer:{
            type:String,
            required:true
        },
        explanation:{
            type:String,
            default:''
        },
        difficulty:{
            type:String,
            enum:["easy","medium","hard"],
            default:"medium"
        }
    }],
    userAnsers:[{
        
    }]

})