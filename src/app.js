import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

// const BASE_URL= process.env.BASE_URL
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
   
}))   
    
  
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
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
app.use("/api/v1/users" , router)
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
//http://localhoast:8000/api/users/register
export {app}