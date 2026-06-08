import express from "express"
import dotenv from  "dotenv"
import connectDb from "./config/connectDb.js";
dotenv.config(); 
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";


const app =  express();
const PORT  =  process.env.PORT  || 6000 ; 

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://yournextjob-1.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth" , authRouter);
app.use("/api/user" ,userRouter );
app.use("/api/interview"  , interviewRouter);
app.use("/api/payment" , paymentRouter);


app.listen(PORT ,()=>{
    console.log(`server listen on port ${PORT}`);
    connectDb();
})
