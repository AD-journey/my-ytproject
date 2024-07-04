import mongoose, { isValidObjectId, set } from "mongoose"
import {Tweet} from "../models/Tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponce} from "../utils/ApiResponce.js"
import {asyncHandler} from "../utils/AsynceHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
         
    if(!content){
        throw new ApiError("no tweete content found")
    }

    const UserTweete = await Tweet.create({
           
           content ,
           owner: req.user?._id

    })

    if(!UserTweete){
        throw new ApiError("failed to create tweet please try again")
    }

    return res.status(200).json(
        new ApiResponce(200 , UserTweete  , "tweee created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const {userId } = req.params

   if(!isValidObjectId(userId)){
       throw new ApiError(400 , "User not found invalid user Id")
   }

   const Usertweet = await Tweet.aggregate([
   
    {
       $match :{
        owner: new mongoose.Types.ObjectId(userId)
       }

    },

    {

        $lookup:{
            from : "users",
            localField : "owner",
            foreignField:"_id",
            as:"ownerdetials",
            pipeline: [
                {
                    $project: {
                        username: 1,
                       "avatar": 1,
                    },
                },
            ],
        }
    }  ,

    {
        $lookup:{
            from: "likes",
            localField:"_id",
            foreignField:"tweet",
            as:"likedetails",
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
                $size: "$likedetails",
            },
            ownerdetials: {
                $first: "$ownerdetials",
            },
            isLiked: {
                $cond: {
                    if: {$in: [req.user?._id, "$likedetails.likedBy"]},
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
            ownerdetials: 1,
            likesCount: 1,
            createdAt: 1,
            isLiked: 1
        },
    },
   ])

   return res
        .status(200)
        .json(new ApiResponce(200, Usertweet, "Tweets fetched successfully"));


})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

      const {content} = req.body
      const {tweetId} = req.params

      if(!content){
        throw new ApiError("no tweete content found")
      }
      
      if(!isValidObjectId(tweetId)){
        throw new ApiError(400 , "invalid tweetId ")
      }

     const tweet = await Tweet.findById(tweetId)

     if(!tweet){
        throw new ApiError(400 ,"tweet not found")
     }
       
     if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can edit thier tweet");
    }

     const UpdateTweet = await Tweet.findByIdAndUpdate(

         tweetId , 
        { $set:{

            content
         },
        
        },
        {
            new: true
         }
     )

     if (!updateTweet) {
        throw new ApiError(500, "Failed to edit tweet please try again");
    }

    return res
        .status(200)
        .json(new ApiResponce(200, updateTweet, "Tweet updated successfully"));

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only owner can delete thier tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res
        .status(200)
        .json(new ApiResponce(200, {tweetId}, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}