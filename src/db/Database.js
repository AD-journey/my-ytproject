
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async ()=>{
    try {
        
      const Connectionitem= await  mongoose.connect("mongodb+srv://deepbaraut123:kamal420@cluster0.shsmlqp.mongodb.net/project" );
      console.log(`\n MONGODB is connectd !!!: ${Connectionitem.connection.host}`)
    } catch (error) { 
          console.log("error is ",error);
          process.exit(1);
    }
}

export default connectDB