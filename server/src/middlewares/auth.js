import expressAsyncHandler from "express-async-handler";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const verifyAuth = expressAsyncHandler(async( req , res, next)=>{
    try {
        const token =  req.header("Authorization")?.replace("Bearer " , "") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZkMzNiNGI2ZTFiZGQ5YzlkMDY4NDAiLCJlbWFpbCI6ImltYW5pa2V0Z3VwdGExMjQ1QGdtYWlsLmNvbSIsImZ1bGxOYW1lIjoiQW5pa2V0IEd1cHRhIiwiaWF0IjoxNzI4MTM1NDc3LCJleHAiOjE3MjgyMjE4Nzd9.np8jz4yQIBsayKbUqc3tFaznisV4UeWElAv9IC0yHg0";
        if(!token){
            res.status(401).json({ message: "Unauthorized request" });
        }
        let decodedToken;
        try {
           decodedToken= jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: "Your Session has been expired",expiredSession:true });
        }
        if(!decodedToken){
            return res.status(401).json({ message: "Your Session has been expired",expiredSession:true });
         }

    
        const  user = await User.findById(decodedToken._id).select("-password");

         if(!user){
           return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }

})