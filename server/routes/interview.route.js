import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer";
import { analyzeResume } from "../controllers/interview.controller";


const interviewRouter =  express.Router();

userRouter.post('/resume', isAuth , upload.single("resume") , analyzeResume);

export default interviewRouter;