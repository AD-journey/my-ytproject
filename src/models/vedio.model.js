import mongoose,{Schema,model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { User } from "./user.model.js";

const  vedioSchema =  new Schema(

    {

        videoFile: {
            type: {
                public_id: String,
                url: String
               },//cloudinary url
            required: true
        },
        thumbnail: {
            type: {
                public_id: String,
                url: String
               }, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: User
        }
    },
    {
        timestamps: true
    }
)

vedioSchema.plugin(mongooseAggregatePaginate)

export const Vedio = model("Vedio", vedioSchema)