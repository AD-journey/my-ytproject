import { Router } from "express";

import { verifyjwt } from "../middlewares/auth.js";
import {  
     getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
} from "../Controller/comment.controler.js";
import { upload } from "../middlewares/multer.js";

const router = Router()

router.use(verifyjwt , upload.none())

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router
