import expressAsyncHandler from "express-async-handler";
import Notification from "../models/notification.js";

// FETCH NOTIFICATIONS
export const fetchAllNotifications = expressAsyncHandler(async (req, res) => {
    const userId = req.user._id; 

    const notifications = await Notification.find({ 
        sender: userId, 
        read: false 
    })
        .populate('sender', 'fullName avatar email') 
        .populate('chat', 'chatName ')
        .sort({ createdAt: -1 }); 

    res.status(200).json({notifications:notifications});
});


// SAVE NOTIFICATIONS

export const saveNotification = expressAsyncHandler(async (req, res) => {
    const { message, sender, chat } = req.body;

    if (!message || !sender || !chat) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const notification = await new Notification({
        message, chat, sender
    })
    const savedNotification = await notification.save();

    if (!savedNotification)
        return res.status(500).json({ message: 'Error while saving notification' })

    res.status(201).json({notification:notification});
});



// DELETE NOTIFCATIONS
export const deleteReadNotifications = expressAsyncHandler(async (req, res) => {
    const userId = req.user._id; 

    const result = await Notification.deleteMany({ sender: userId, read: true });
    
    res.status(200).json({ message: `${result.deletedCount} read notifications deleted.` });
});