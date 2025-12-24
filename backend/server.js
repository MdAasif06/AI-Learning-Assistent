import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js"
import errorHandler from "./middleware/errorHandler.js"
import authRoutes from "./routes/authRoute.js"
import documentRoute from "./routes/documentRoute.js"

//connected to Database
connectDB();

//ES6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Initilize express app
const app = express();


//middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//static folder for uploads
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

//Routes
app.use('/api/auth',authRoutes)
app.use('/api/documents',documentRoute)



app.use(errorHandler)


//404 handler
app.use((req,res)=>{
    res.status(404).json({
        success:true,
        error:"Route not found",
        successCode:404
    })
})

//start the server
const PORT=process.env.PORT ||8000
app.listen(PORT,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error ${err.mssage}`)
    process.exit(1)
})