
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();  


export const ConnectDB = async()=>{
  try{
  await mongoose.connect(process.env.Mongoose_URL ?? "");
    console.log("Connected to MongoDB Successfully");
  } catch(err){
    console.log("Error while connecting to MongoDB", err)
    process.exit(1); // Exit app if DB connection fails
  }
}