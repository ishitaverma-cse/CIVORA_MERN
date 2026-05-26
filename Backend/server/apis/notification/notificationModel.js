const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  
    // receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User",  },
    // senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: "issue" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isAdmin: { type: Boolean, default: false },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    type: {
        type: String,
        enum: [
            "ISSUE_REPORTED",
            "ISSUE_ASSIGNED",
            "STATUS_UPDATED",
            "EMPLOYEE_REMARK",
            "ISSUE_RESOLVED",
            "UPVOTED"
        ]
    },
    status: {
        type: String,
        enum: [
            "Pending",
            "Assigned",
            "In Progress",
            "Resolved",
            "Rejected"
        ]
    },
    message: { type: String, required: true },
    remark: { type: String, default: "" },
    proofImage: { type: String, default: "" },

    isRead: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
},
    { timestamps: true });                        //automatically creates createdAt and updatedAt.


module.exports = mongoose.model('notification', notificationSchema);