import mongoose, { isValidObjectId } from "mongoose";

import { Subscription } from "../models/Subscripition.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/AsynceHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!isValidObjectId(channelId)) {
    throw new ApiError();
  }

  const isSubscribed = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (isSubscribed) {
    await Subscription.findByIdAndDelete(isSubscribed?._id);

    return res
      .status(200)
      .json(
        new ApiResponce(200, { subscribed: false }, "unsubscribed successfull")
      );
  }

  await Subscription.create({
    subscriber: req.user?._id,
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponce(200, { subscribed: true }, "Subscriber is successfull")
    );
});

// controller to return subscriber list of a channel
// const getUserChannelSubscribers = asyncHandler(async (req, res) => {
//   const { channelId } = req.params;

//   if (!isValidObjectId(channelId)) {
//     throw new ApiError(400, "Invalid channelId");
//   }

   

//   const subscribers = await Subscription.aggregate([
//     {
//       $match: {
//         Channel: new mongoose.Types.ObjectId(channelId)
//       },
//     },

//     {
//       $lookup: {
//         from: "users",
//         localField: "Subscriber",
//         foreignField: "_id",
//         as: "subscriber",
//         pipeline: [
//           {
//             $lookup: {
//               from: "subscriptions",
//               localField: "_id",
//               foreignField: "Channel",
//               as: "subscribedToSubscriber"
             
             
//             },
//           },
         

//           {
//             $addFields: {
//               subscribedToSubscribe: {
//                 $cond: {
//                   if: {
//                     $in: [channelId," $subscribedToSubscriber.Subscriber"],
//                   },
//                   then: true,
//                   else: false,
//                 },
//               },
//               subscriberCount: {
//                 $size:" $subscribedToSubscriber",
//               },
             
//             },
//           },
          
//         ],
//       },
     
//     },
//     {
//       $unwind: "$subscriber",
//   },
//     {
//         $project: {
//             _id:0,
//             Subscriber: {
//               _id: 1,
//               username: 1,
//               fullName: 1,
//               "avatar.url": 1,
//               subscribedToSubscribe: 1,
//               subscriberCount: 1,
//           },
//         },
//     }, 
//   ]);
//   console.log(subscribers)

//   return res.status(200).json(
    
//         new ApiResponce(200 ,subscribers,"subscriber fetched successfully")
    
//   )
// });
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  let { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid channelId");
  }

  // channelId = new mongoose.Types.ObjectId(channelId);

  const subscribers = await Subscription.aggregate([
      {
          $match: {
              channel: new mongoose.Types.ObjectId(channelId)
          },
      },
      {
          $lookup: {
              from: "users",
              localField: "subscriber",
              foreignField: "_id",
              as: "subscriber",
              pipeline: [
                  {
                      $lookup: {
                          from: "subscriptions",
                          localField: "_id",
                          foreignField: "channel",
                          as: "subscribedToSubscriber", 
                      },
                  },
                  {
                      $addFields: {
                          subscribedToSubscriber: {
                              $cond: {
                                  if: {
                                      $in: [
                                          channelId,
                                          "$subscribedToSubscriber.subscriber",
                                      ],
                                  },
                                  then: true,
                                  else: false,
                              },
                          },
                          subscribersCount: {
                              $size: "$subscribedToSubscriber",
                          },
                      },
                  },
              ],
          },
      },
      {
          $unwind: "$subscriber",
      },
      {
          $project: {
              _id: 0,
              subscriber: {
                  _id: 1,
                  username: 1,
                  fullName: 1,
                  "avatar": 1,
                  subscribedToSubscriber: 1,
                  subscribersCount: 1,
              },
          },
      },
  ]);

  return res
      .status(200)
      .json(
          new ApiResponce(
              200,
              subscribers,
              "subscribers fetched successfully"
          )
      );
});




// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

     const subscribedchannels = await Subscription.aggregate([
                  {
                    $match:{
                        subscriber : new mongoose.Types.ObjectId(subscriberId)
                    }
                  },
                  {
                    $lookup:{
                        from:"users",
                        localField:"channel"
                        ,foreignField:"_id",
                        as:"subscribedChannel",
                        pipeline:[
                           {
                           $lookup:{
                            from: "vedios",
                            localField: "_id",
                            foreignField: "owner",
                            as: "vedios",
                           }
                           } ,

                           {
                            $addFields:{
                                latestvedio:
                                {
                                  $last: "$vedios" 
                                }
                            }
                           }
                        ]
                    }
                  },
                  {
                    $unwind:"$subscribedChannel"
                  },
                  {
                    $project:{

                        _id:0,
                        subscribedChannel:{
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            "avatar": 1,
                            latestvedio: {
                                _id: 1,
                                "videoFile.url": 1,
                                "thumbnail.url": 1,
                                owner: 1,
                                title: 1,
                                description: 1,
                                duration: 1,
                                createdAt: 1,
                                views: 1}

                        }
                    }
                  }
     ])


     return res.status(200).json(
        new ApiResponce(400 ,subscribedchannels, "subscribed channel fetched successfullu")
     );
      
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
