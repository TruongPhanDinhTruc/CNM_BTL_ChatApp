const mongoose = require('mongoose');
const groupMessageSchema = new mongoose.Schema({
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    messageType: {
        type: String,
        enum: ["text", "image"]
    },
    message: String,
    imageUrl: String,
    timeStamp: {
        type: Date,
        default: Date.now,
    }
});

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

module.exports = GroupMessage;