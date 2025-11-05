import expressAsyncHandler from 'express-async-handler';
import Message from '../models/message.js';
import User from '../models/user.js';
import Chat from '../models/chat.js';
import { json } from 'express';
import { deleteFromCloudinary, publicId, uploadToCloudinary } from "../utils/cloudinary.js";


// SEND MESSAGE

export const sendMessage = expressAsyncHandler(async (req, res) => {
    const { chatId, content } = req.body;
    if (!chatId) {
        return res.status(400).json({ message: "Invalid Chat ID" });
    }

    let media = null;

    if (req.file) { 
        try {
            const uploadResult = await uploadToCloudinary(req.file.path, 'chat_media');
            
            // console.log(uploadResult)
            media = {
                url: uploadResult.secure_url,
                fileType: req.file.mimetype.split('/')[0], 
                fileName: req.file.originalname,
                fileSize: req.file.size
            };
        } catch (error) {
            console.log("Cloudinary upload error:", error);
            return res.status(500).json({ message: "File upload error" });
        }
    }

    const newMessage = {
        sender: req.user._id,
        content: content || "", 
        chat: chatId,
        media: media ? media : undefined 
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "fullName avatar email");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "fullName avatar email"
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.status(200).json({ message });
    } catch (error) {
        console.log("Database error:", error);
        res.status(500).json({ message: "Internal error while sending message" });
    }
});



// FETCH MESSAGES
export const fetchMessages = expressAsyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "fullName avatar email")
            .populate("chat");
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: "Internal Error while fetching messages" });
    }
});

// FETCH ALL MESSAGES
export const fetchAllMessages = expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: userId } }
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .populate({
                path: "latestMessage.sender",
                select: "fullName email avatar",
            });

        let allChatsMessages = [];
        for (let chat of chats) {
            await Message.find({ chat: chat._id })
                .populate("sender", "fullName avatar email")
                .populate("chat")
                .then((messages) => {
                    allChatsMessages.push({ chat, messages });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        if (allChatsMessages.length > 0) {
            res.status(200).json({ allChatsMessages: allChatsMessages });
        } else {
            res.status(200).json({ message: "No messages found" });
        }


    } catch (error) {
        res.status(500).json({ message: "Internal Error while All chats messages" });
    }
});


// UPDATE THE DELIEVERED STATUS OF MESSAGES
export const updateDeliveredStatus = expressAsyncHandler(async (req, res) => {
    const { messageId, userId } = req.body;
    if (!messageId || !userId) {
        console.log("invalid data passed into request");
        return res.sendStatus(400);
    }

    try {
        const message = await Message.findById(messageId);
        message.deliveredTo.push(userId);
        await message.save();
        res.status(200).json({ message: "Message delivered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error while updating delivered status" });
    }
});

// READ STATUS OF MESSAGES
export const updateReadStatus = expressAsyncHandler(async (req, res) => {
    const { messageId, userId } = req.body;
    if (!messageId || !userId) {
        console.log("invalid data passed into request");
        return res.sendStatus(400);
    }

    try {
        const message = await Message.findById(messageId);
        message.readBy.push(userId);
        await message.save();
        res.status(200).json({ message: "Message delivered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error while updating delivered status" });
    }
});
