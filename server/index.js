import express from "express"
import dotenv from  "dotenv"
import connectDb from "./config/connectDb.js";
dotenv.config(); 


const app =  express();
app.get('/' , (req , res )=>{
    return res.json({
        message : "message send succesfully"
    })
})


app.listen(process.env.PORT ,()=>{
    console.log(`server listen on port ${process.env.PORT}`);
    connectDb();
})