import { Router } from "express";

import { verifyjwt } from "../middlewares/auth.js";
import {  
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../Controller/like.controler.js";

const router = Router()

router.use(verifyjwt)

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router
