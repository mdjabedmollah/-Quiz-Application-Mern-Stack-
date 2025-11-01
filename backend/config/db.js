import mongoose  from "mongoose";
import 'dotenv/config'
export const connectionDb=async()=>{
   try {
     await mongoose.connect(process.env.MONGO_URL)
     console.log("data base connetion successfully")
   } catch (error) {
    console.log(error)
   }
}