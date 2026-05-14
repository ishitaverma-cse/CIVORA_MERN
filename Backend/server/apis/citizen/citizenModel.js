const mongoose = require('mongoose')

const citizenSchema = new mongoose.Schema({

    autoId: { type: Number, default: 0 },
    name: { type: String, default: "", },
    email: { type: String, },
    password: { type: String, },
    userType: { type: Number, default: 3, }, //1-admin, 2-employee, 3-citizen
    phone: { type: Number, default: null },
    gender: { type: String, default: null },
    address: { type: String, default: null },

    isDelete: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

module.exports = mongoose.model('citizen', citizenSchema)
