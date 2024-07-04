import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { verifyjwt } from "../middlewares/auth.js";
import { getAllVideos,
    publishAVideo,
    getVedioById,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from "../Controller/vedio.controler.js"

    const router = Router()

    router.route("/").get(getAllVideos).post(verifyjwt,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }        
        ]),
        publishAVideo
    );

    router
    .route("/v/:videoId")
    .get(verifyjwt, getVedioById)
    .delete(verifyjwt, deleteVideo)
    .patch(verifyjwt, upload.single("thumbnail"), updateVideo);
    router.route("/toggle/publish/:videoId").patch(verifyjwt, togglePublishStatus)
    

    export  default router