import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

// const BASE_URL= process.env.BASE_URL
const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
   
}))   
    
  
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("dist"))
app.use(cookieParser())
app.use(morgan("dev"))

//routre things

import { router } from "./routes/user.route.js"
import videoRouter from "./routes/video.rout.js";
import commentRouter from "./routes/comment.router.js";
import likeRouter from "./routes/like.router.js";
import subscriptionRouter from "./routes/subscription.router.js";
import tweetRouter from "./routes/tweet.router.js";

import healthcheckRouter from "./routes/Healthcheckup.router.js";
import playlistRouter from "./routes/playlist.router.js";                                                      
import dashboardRouter from "./routes/dashboard.router.js";



//rout decleration
app.use("/v1/users" , router)
app.use("/v1/video", videoRouter);
app.use("/v1/comment", commentRouter);
app.use("/v1/likes", likeRouter);
app.use("/v1/subscriptions", subscriptionRouter);
app.use("/v1/tweet", tweetRouter);
app.use("/v1/healthcheck", healthcheckRouter);
app.use("/v1/playlist", playlistRouter);
app.use("/v1/dashboard", dashboardRouter);
//http://localhoast:8000/api/users/register
export {app}