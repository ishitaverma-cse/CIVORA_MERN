const mongoose = require('mongoose')

const upvoteSchema = new mongoose.Schema({
    autoId: { type: Number, unique: true },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },          
    citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "Citizen" },         
    
    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
},
    { timestamps: true });                        //automatically creates createdAt and updatedAt.


module.exports = mongoose.model('upvote', upvoteSchema);