const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    autoId: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },   //employee linked to user account.
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },

    name: { type: String, default: "" },
    email: { type: String },
    password: { type: String },
    userType: { type: Number, default: 2 }, //1-admin, 2-employee, 3-citizen 
    profileImage: { type: String, default: "" },

    designation: { type: String },                     
    status: { type: String, default: 'active' },
    phone: { type: Number, default: 1 },
    address: { type: String, default: null },
    salary: { type: Number, default: 0 },

    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},
    { timestamps: true });                                 //automatically creates createdAt and updatedAt.


module.exports = mongoose.model('employees', employeeSchema);