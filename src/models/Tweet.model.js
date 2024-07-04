  import mongoose ,{Schema} from "mongoose";
import { User } from "./user.model.js";

  const TweetSchema = new Schema({
             
            owner:{
                type: Schema.Types.ObjectId,
                ref:User
            },
            content:{
                type: String,
                required: [true, "content is required"]
            }
  }     ,
      {
        timestamps:true
      }
)

export const Tweet = mongoose.model("Tweet" , TweetSchema)