import { Router } from "express";

import { verifyjwt } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import { createTweet,getUserTweets,
    updateTweet,
    deleteTweet } from "../Controller/Tweet.controler.js";
   
    const router = Router()

    router.use(verifyjwt, upload.none()); // Apply verifyJWT middleware to all routes in this file

    router.route("/").post(createTweet);
    router.route("/user/:userId").get(verifyjwt,getUserTweets);
    router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);
    
    export default router;   