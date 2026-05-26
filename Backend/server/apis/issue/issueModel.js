const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    title: { type: String, default: "" },
    description: { type: String },

    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

    status: { type: String, enum: ["Pending", "In Progress", "Resolved", "Rejected"], default: "Pending" },
    location: { type: String },
    media: [{ type: String }],     //supports mult images/videos later.

    aiSeverityScore: { type: Number, default: 0 },
    aiPriority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    remarks: { type: String },
    proofImage: { type: String },

    //NEW FIELDS
    isPublic: { type: Boolean, default: true },
    upvotes: { type: Number, default: 0 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "employees", default: null },

    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
},
    { timestamps: true });                                 //automatically creates createdAt and updatedAt.


module.exports = mongoose.model('issue', issueSchema);