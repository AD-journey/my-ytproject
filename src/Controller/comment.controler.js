
import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/Comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponce} from "../utils/ApiResponce.js"
import {asyncHandler} from "../utils/AsynceHandler.js"
import { Vedio } from "../models/vedio.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw new ApiError(400  ,"invalid userId")
    }

    const vedio = await Vedio.findById(videoId)

    if(!vedio){
        throw new ApiError(400  ,"vedio not found")

    }

    const commentsAggregate =  Comment.aggregate([
                   
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },  
            
            {
                $lookup:{

                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerdetails",
               
               
                }
            },
            {

                $lookup:{

                    from:"likes",
                    localField:"_id",
                    foreignField:"comment",
                    as:"likes",
                    pipeline:[
                        {
                            $project: {
                                likedBy: 1,
                            },
                        }
                    ]
                   
                           
                }
            },
            {
                $addFields: {
                    likesCount: {
                        $size: "$likes"
                    },
                    ownerdetails: {
                        $first: "$ownerdetails"
                    },
                    isLiked: {
                        $cond: {
                            if: { $in: [req.user?._id, "$likes.likedBy"] },
                            then: true,
                            else: false
                        }
                    }
                },
               
            },
           
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    likesCount: 1,
                    ownerdetails:{
                        username:1,
                        fullName:1,
                        "avatar":1
                    },
                    isLiked: 1
                }
            }
           
    ])

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const comments = await Comment.aggregatePaginate(
        commentsAggregate,
        options
    );
      
    return res
    .status(200)
    .json(new ApiResponce(200, comments, "Comments fetched successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    const {videoId} = req.params
     

    if(!videoId){
        throw new ApiError(400  ,"invalid userId")
    }

    if(!content){
        throw new ApiError(400  ,'content not found')
    }

    const video = await Vedio.findById(videoId)

    if(!video){
        throw new ApiError(400  ,'video not found')
    }



    const createCommetn = await Comment.create({
             
       
          content,
          video:videoId,
          owner : req.user?._id

    })

    if(!createCommetn){
        throw new ApiError(400 , "comment not found")
    }


    return res.status(200).json(
        new ApiResponce(200 ,createCommetn, "comment created sucessfully")
    )
})


const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content } = req.body
   
    if(!content){
        throw new ApiError(400  ,'content not found')
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400 , "Invalid comment Id")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400  , "comment not found")
    }

    if(comment?.owner.toString() !== req.user?._id.toString()){
         throw new ApiError(400 ," invalied user")
    }
    
    const updatedComment = await Comment.findByIdAndUpdate(
        comment?._id,
        {
            $set: {
                content
            }
        },
        { new: true }
    );

    if(!updatedComment){
        throw new ApiError(400 , "Comment not updated")
    }

    return res.status(200).json(
        new ApiResponce( 200 , updatedComment , "comment updated successfully")
    )




        
      
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can delete thier comment");
    }

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponce(200, {commentId}, "comment deleted successfully"));


})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
