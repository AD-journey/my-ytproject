import mongoose , {Schema} from "mongoose";
import { User } from "./user.model.js";
import { Vedio } from "./vedio.model.js";

const PlaylistSchema  = new Schema({
           
           name:{
            type: String,
            required :  true
           },
           owner:{
            type: Schema.Types.ObjectId,
            ref:User

           },
           videos:[
           {
              type: Schema.Types.ObjectId,
                ref: "Vedio"
           }],
           description: {
            type: String,    
            required: [true, "description is required"]
        },
},
{
    timestamps: true
}
)

export const Playlist = mongoose.model("Playlist" , PlaylistSchema)