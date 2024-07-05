import { Schema } from "mongoose";
import mongoose  from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const userSchema = new Schema(
    {

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: {
                public_id: String,
                url: String //cloudinary url
            },
        },

        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Vedio"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
       
    },
    {
        timestamps:true
    }
)

userSchema.pre("save" , function(next){
      
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hashSync(this.password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = function(password){

    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
         process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "10d"
        }
    )
}




export const User = mongoose.model("User", userSchema)