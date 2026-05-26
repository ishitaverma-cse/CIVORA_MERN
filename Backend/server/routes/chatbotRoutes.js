const express = require('express');            //import express.
const router = express.Router()                //create router ~ used to handle all api's.

//import
const chatbotController = require('../apis/chatBot/chatbotController');


//create route 
router.post("/chat", chatbotController.chatbot);



module.exports = router;                      //export router ~ to use in another file.