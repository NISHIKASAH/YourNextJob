import mongoose from "mongoose" 

const connectDb =  async ()=>{
    try{
        await mongoose.connect(process.env.MONGODBURL);
        console.log("database connected");

    }catch (error){
        console.log(`mongodb connection error ${error}`);
    }
}

export default connectDb;