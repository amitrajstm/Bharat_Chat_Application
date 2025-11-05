import { mongoose, model } from "mongoose";
const chatModel = mongoose.Schema({

    chatName:{
      type: String,
      trim: true
    },

    isGroupChat: {
      type: Boolean,
      default: false
    },
    
    groupAvatar: {
      type: String,
      default: "https://cdn-icons-png.freepik.com/512/1057/1057089.png", 
    },

    groupDescription: {
      type: String,
      default: ""
    },

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,  //to display at front
      ref: "Message",
    },

   

  }, { timestamps: true } );

const Chat = model("Chat", chatModel);

export default Chat;