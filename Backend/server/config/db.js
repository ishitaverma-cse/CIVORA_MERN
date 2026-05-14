const mongoose = require('mongoose')       //import mongoose ~ a library that helps Node.js talk to MongoDB easily.
const connectDB = async () => {                 //creating a function so that we can call it anytime to connect DB.
    try {
        await mongoose.connect(process.env.DB)
        console.log("DB is connected successfully!!!")
    }
    catch(err){
        console.log("Error connecting DB: ", err)
    }
}

module.exports = connectDB


