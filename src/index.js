


import connectDB from "./db/Database.js";
import dotenv from "dotenv";

import { app } from "./app.js";
// import { router } from "./routes/user.route.js"
    
dotenv.config({
     path:"./.env"
})
  
  

  app.get("/gate" , (req , res )=>{
    res.send(`hi i am rununig at ${process.env.CORS_ORIGIN}`)
  })


connectDB()
.then(()=>{ 
      app.listen(process.env.PORT || 3000, ()=>{
           console.log(`The port is running on port ${process.env.PORT} `)
      })
})
.catch((err)=>{
       
    console.log("Server is faild to connect :", err)
})

//  app.get("/api/users" , )

/*
const app= express();



;( async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        
       app.on("error",(error)=>{
        console.log("error",error);
        throw error;
       })

       app.listen(process.env.PORT,()=>{
        console.log(`the port is on ${process.env.PORT}`)
       })
    } catch (error) {
        console.error("ERROR",error);
        throw error;
    }
})()  */