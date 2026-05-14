const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    autoId: { type: Number },
    name: { type: String, default: "" },
    description: { type: String },
    status: { type: Boolean},

    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
},
    { timestamps: true });                                //automatically creates createdAt and updatedAt.


module.exports = mongoose.model('category', categorySchema);