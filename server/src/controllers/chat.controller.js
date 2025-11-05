import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import {deleteFromCloudinary, publicId, uploadToCloudinary} from "../utils/cloudinary.js"
// new chat creation or Access chat
export const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body; // id of the user with whom you want to chat

    if (!userId) {
        return res.status(400).json({ message: "User Id Required" });
    }

    const isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("users", "-password").populate({
        path: "latestMessage",
        populate: {
            path: "sender",
            select: "fullName email avatar",
        },
    });;
    if (isChat.length > 0)
        return res.status(200).json({ chat: isChat })

    const newChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
        latestMessage: null
    });

    const fullChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password").populate("latestMessage");
    res.status(200).json({ chat: fullChat });

});


//  fetch chats
export const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })  // new to old sorting
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "fullName email avatar",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching chats" });
        throw new Error(error);
    }
})


//  create group chat
export const createGroupChat = expressAsyncHandler(async (req, res) => {
    const { users, groupChatName } = req.body;
    const avatar = req.file;

    const usersArray = JSON.parse(users);
    let imageUrl=''
    if (avatar && avatar.size < 3000000) {
        try {
             imageUrl = await uploadToCloudinary(avatar.path);
        } catch (error) {
            console.log(error)
        }
    }

    if (!users || !groupChatName) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    if (usersArray.length < 2) {
        return res.status(400).json({ message: "Atleast 2 users are required" });
    }

    if (usersArray.includes(req.user._id.toString())) {
        return res.status(400).json({ message: "You are already in the group" });
    }

    usersArray.push(req.user._id);
    const groupChat = await Chat.create({
        chatName: groupChatName,
        users: usersArray,
        isGroupChat: true,
        groupAdmin: req.user._id,
        groupAvatar: imageUrl?.url
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    res.status(200).json({ chat: fullGroupChat });
});


export const updateGroupDetails = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName,groupDescription } = req.body;  //chatName is the New Name of the group

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName , groupDescription},
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404).json({ message: "Chat Not Found" });
    }
    res.status(200).json({ chat: updatedChat });
});

export const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, users } = req.body;
    if (!users.length) {
        return res.status(400).json({ message: "User Id Required" });
    }

    const chat = await Chat.findById(chatId);
    const groupAdmin = chat.groupAdmin;

    if (groupAdmin.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: "Only Group Admin can add new members" });
    }

    // Filter out pre existed ones
    const existingUsers = chat.users.map(user => user.toString());
    const newUsers = users.filter(user => !existingUsers.includes(user.toString()));

    if (!newUsers.length) {
        return res.status(400).json({ message: "All selected users are already in the group" });
    }

    const addedUser = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: { $each: newUsers } } }, // Use $each to add multiple users
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!addedUser) {
        return res.status(404).json({ message: "Chat Not Found" });
    }

    res.status(200).json({ chat: addedUser });
});


export const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User Id Required" });
    }
    const chat = await Chat.findById(chatId);
    const groupAdmin = chat.groupAdmin;

    if (groupAdmin.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: "Only Group Admin can remove members" });
    }
    const removedUser = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId },
    },
        { new: true }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removedUser) {
        res.status(404).json({ message: "Chat Not Found" });
    }
    res.status(200).json({ message: "User Removed", chat: removedUser });
});


export const updateGroupProfileImage = expressAsyncHandler(async (req, res) => {
    const { chatId } = req.body;

    if (!chatId) {
        return res.status(400).json({ message: "Chat Id Required" });
    }
    const avatar = req.file;
    if (!avatar) {
        return res.status(400).json({ message: "Please upload an image" });
    }
    if (avatar.size > 3000000) {
        return res.status(400).json({ message: "File size too large pls upload less than 2mb" });
    }

    const groupChat = await Chat.findById({_id:chatId})
    const picid = publicId(groupChat?.groupAvatar);

    if (picid) {
        try {
            await deleteFromCloudinary(picid);
        } catch (err) {
            console.log(err)
        }
    }

    const imageUrl = await uploadToCloudinary(avatar.path);
    if (!imageUrl?.url) {
        return res.status(500).json({ message: "something went wrong while uploading file" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { groupAvatar: imageUrl.url }, { new: true });
    if (!updatedChat)
        return res.status(500).json({ message: "something went wrong while updating profile" });

    res.status(200).json({ message: 'Image Updated🎉', updatedChat });

});

// DELETE CHAT
export const deleteChat = expressAsyncHandler(async (req, res) => {
    const { chatId } = req.body;
    if (!chatId) {
        return res.status(400).json({ message: "Chat Id Required" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        return res.status(404).json({ message: "Chat Not Found" });
    }
  

});