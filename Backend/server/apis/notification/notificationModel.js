const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    autoId: { type: Number, unique: true, required: true },
    // receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User",  },
    // senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    type: { type: String, enum: ["ISSUE_ASSIGNED", "STATUS_UPDATED", "ISSUE_RESOLVED", "UPVOTED"] },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },

    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
},
    { timestamps: true });                        //automatically creates createdAt and updatedAt.


module.exports = mongoose.model('notification', notificationSchema);