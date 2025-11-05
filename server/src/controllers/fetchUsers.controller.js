import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import Message from '../models/message.js';
// fetch all users
// api/users/all?search=userName
export const fetchUsers = asyncHandler(async (req, res) =>{
    const keyword = req.query.search ? {
        $or: [
            { fullName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ], 
    }:{};
    const users = await User.find(keyword).find({
        _id: { $ne: req.user._id },
    });

    if(!users){
        res.status(404).json({message: "No users found"});
    }    

    res.status(200).json({message: "Users Fetch Success",users:users});
});
