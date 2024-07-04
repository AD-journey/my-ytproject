import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/Playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponce} from "../utils/ApiResponce.js"
import {asyncHandler} from "../utils/AsynceHandler.js"
import { Vedio } from "../models/vedio.model.js"
import { upload } from "../middlewares/multer.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

         if(!name || !description){
            throw new ApiError(400, "name and description is required")
         }

         const PlaylistCreat = await Playlist.create({
               
                 name,
                 description,
                 owner:req.user?._id
         })

         if(!PlaylistCreat){
            throw new ApiError(400  , 'playlist not created')
         }


         return res.status(200).json(

            new ApiResponce(200 ,{ PlaylistCreat} ,"playlist is created" )

         )
})  

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){

        throw new ApiError(400 , "invalied user id")
    }

    const playlist = await Playlist.aggregate([
               
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },

        {
            $lookup:{

                from:"vedios",
                localField:"videos"
                ,foreignField:"_id",
                as:"videos"
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                updatedAt: 1
            }
        }
    ]) 
    
    return res
    .status(200)
    .json(new ApiResponce(200, playlist, "User playlists fetched successfully"));

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId");
    }

    const playlist = await Playlist.findById(playlistId);
       console.log(playlist)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const playlistVideo = await Playlist.aggregate([

        {
            $match:{
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup:{
                   
                  from:"vedios",
                  localField:"videos"
                  ,foreignField:"_id",
                  as:"videos",
                 
            }
        },
          {
            $match: {
                "videos.isPublished": true,
          }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
               
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                },
                owner: {
                    $first: "$owner"
                },
                // videos: {
                //     $first: "$videos"
                // }
            }
        },

        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                totalVideos: 1,
                totalViews: 1,
                videos: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    createdAt: 1,
                    views: 1
                },
                owner: {
                    username: 1,
                    fullName: 1,
                    "avatar": 1
                }
            }
        }
    ])
        
    return res.status(200).json(
        new ApiResponce(200 , playlistVideo  , "playlist fetched successfully")
    )

     
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid PlaylistId or videoId");
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Vedio.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (!video) {
        throw new ApiError(404, "video not found");
    }

    if (
        (playlist.owner?.toString() && video.owner.toString()) !==
        req.user?._id.toString()
    ) {
        throw new ApiError(400, "only owner can add video to thier playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $addToSet: {
                videos: videoId,
            },
        },
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(
            400,
            "failed to add video to playlist please try again"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                updatedPlaylist,
                "Added video to playlist successfully"
            )
        );


})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
          
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid PlaylistId or videoId");
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Vedio.findById(videoId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (!video) {
        throw new ApiError(404, "video not found");
    }

    if (
        (playlist.owner?.toString() && video.owner.toString()) !==
        req.user?._id.toString()
    ) {
        throw new ApiError(
            404,
            "only owner can remove video from thier playlist"
        );
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                updatedPlaylist,
                "Removed video from playlist successfully"
            )
        );
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "comment not found");
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can delete thier comment");
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponce(200, {playlistId}, "comment deleted successfully"));



})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    
    if(!name || !description){
        throw new ApiError(400, "name and description is required")
     }


    if(!isValidObjectId(playlistId)){
        throw new ApiError(400 , "Invalid playlist Id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(400  , "playlist not found")
    }

    if(playlist?.owner.toString() !== req.user?._id.toString()){
         throw new ApiError(400 ," invalied user")
    }
    
    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlist?._id,
        {
            $set: {
                name,
                description,
                owner:req.user?._id
            }
        },
        { new: true }
    );

    if(!updatePlaylist){
        throw new ApiError(400 , "playlist not updated")
    }

    return res.status(200).json(
        new ApiResponce( 200 , updatePlaylist , "playlist updated successfully")
    )



})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}