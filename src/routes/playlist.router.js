import { Router } from "express";

import { verifyjwt } from "../middlewares/auth.js";

import {  createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist } from "../Controller/Playlist.controler.js";
    import { upload } from "../middlewares/multer.js";

    const router = Router()

    router.use(verifyjwt, upload.none()); // Apply verifyJWT middleware to all routes in this file

    router.route("/").post(createPlaylist);
    
    router
        .route("/:playlistId")
        .get(getPlaylistById)
        .patch(updatePlaylist)
        .delete(deletePlaylist);
    
    router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
    router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);
    
    router.route("/user/:userId").get(getUserPlaylists);

    export default router