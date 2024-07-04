
import { asyncHandler } from "../utils/AsynceHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js"


export const verifyjwt = asyncHandler(async(req,res,next)=>{
      
  try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        
      if (!token) {
          throw new ApiError(401, "Unauthorized request")
      }
  
      const decodedToken = jwt.verify(token, "chai-aur-code")
        
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
         
      if (!user) {
              
          throw new ApiError(401, "Invalid Access Token")
      }
       
      req.user = user;
          next()
  } catch (error) {
        
    throw new ApiError(401, error?.message || "Invalid access token") 
  }
})