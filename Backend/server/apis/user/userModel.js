const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    name: { type: String, default: "", },
    email: { type: String },
    password: { type: String, },
    userType: { type: Number, default: 3, },    //1-admin, 2-employee, 3-user
    phone: { type: Number, default: null },
    address: { type: String, default: null },

    isDelete: { type: Boolean, default: false },
    isBlocked: { type: Boolean },
    blockReason: { type: String, default: "" }, //extra field
    resetOtp: { type: String },
    otpExpire: { type: Date },
    
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

module.exports = mongoose.model('users', userSchema)