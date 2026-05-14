const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
    autoId: { type: Number, unique: true, required: true },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: "issue" },           //employee linked to user account.
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    status: { type: String, enum: ['assigned', 'unassigned', 'in_progress', 'completed', 'rejected'], default: 'assigned' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },

    isActive: { type: Boolean, default: true },    //ensure only 1 assignment exists.
    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "employees" }
},
    { timestamps: true });                                  //automatically creates createdAt and updatedAt.


module.exports = mongoose.model('assignment', assignmentSchema);