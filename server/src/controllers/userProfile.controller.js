import expressAsyncHandler from "express-async-handler";
import { deleteFromCloudinary, publicId, uploadToCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.js";

// UPDATE AVATAR
export const updateAvatar = expressAsyncHandler(async (req, res) => {

    const avatar = req.file;
    if (!avatar) {
        return res.status(400).json({ message: "Please upload an image" });
    }
    if (avatar.size > 3000000) {
        return res.status(400).json({ message: "File size too large pls upload less than 2mb" });
    }

    const picid = publicId(req.user.avatar);
    if (picid) {
        try {
            await deleteFromCloudinary(picid);
        } catch (err) {
        }
    }

    const imageUrl = await uploadToCloudinary(avatar.path);
    if (!imageUrl?.url) {
        return res.status(500).json({ message: "something went wrong while uploading file to cloudinary" });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { avatar: imageUrl?.url }, { new: true });
    if (!user)
        return res.status(500).json({ message: "something went wrong while updating profile" });

    res.status(200).json({ message: 'Profile Image Updated🎉', user });


});

// DELETE AVATAR
export const deleteAvatar = expressAsyncHandler(async (req, res) => {
    const picid = publicId(req.user.avatar);

    try {
        await deleteFromCloudinary(picid);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "something went wrong while deleting file from cloudinary" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" }, { new: true });
    res.status(200).json({ message: 'Profile Image Deleted🎉', user });

});


// UPDATE PROFILE

export const updateProfile = expressAsyncHandler(async (req, res) => {
    const { fullName, about, userName } = req.body;

    if (userName) {
        const existingUser = await User.findOne({
            userName: userName,
            _id: { $ne: req.user._id }
        });
        if (existingUser)
            return res.status(400).json({ message: "username not available" });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { fullName, about, userName }, { new: true });
    if (!user)
        return res.status(500).json({ message: "something went wrong while updating profile" });

    res.status(200).json({ message: 'Profile Updated🎉', user });
});