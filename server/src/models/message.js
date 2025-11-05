import mongoose from "mongoose"
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    content: {
        type: String,
    },
    media: {
        url: { type: String },   
        fileType: { type: String },       
        fileName: { type: String },        
        fileSize: { type: Number }        
    },
    // readBy: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // }],
    // deliveredTo: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'User',
    //     }
    // ],

}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema);
export default Message ;