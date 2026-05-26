const express = require('express')
const router = express.Router() 
// const upload = require("../middleware/multer");
const multer = require('multer');



//import
const CitizenController = require('../apis/citizen/citizenController')
const issueController = require('../apis/issue/issueController')
const upvoteController = require('../apis/upvote/upvoteController')
const homeController = require("../apis/homee/homeController");
const contactController = require("../apis/contact/contactController");
const notificationController = require('../apis/notification/notificationController')

const cloudStorage = multer.memoryStorage();
const cloudUpload = multer({ storage: cloudStorage });



//create PUBLIC  routes
//REGISTER
router.post('/register', CitizenController.register);

//HOME
router.post("/homee/stats", homeController.homeStats);

//CONTACT 
router.post('/contact/add', contactController.add);

//ISSUE
router.post('/issue/public', issueController.public);


//TOKEN CHECKER
router.use(require('../middleware/tokenChecker')); 


 
//PROTECTED routes
//ISSUE
router.post('/issue/add', cloudUpload.single("media"), issueController.add);
router.post('/issue/all', issueController.all);
router.post('/issue/single', issueController.single);
router.post('/issue/update',cloudUpload.single("media"), issueController.update);
router.post('/issue/softDelete', issueController.softDelete);
router.post('/issue/my', issueController.myIssues);


//UPVOTE
router.post('/upvote/add', upvoteController.add);
router.post('/upvote/all', upvoteController.all);
router.post('/upvote/single', upvoteController.single);
router.post('/upvote/softDelete', upvoteController.softDelete);

//NOTIFICATION
router.post('/notification/myNotifications', notificationController.myNotifications)
router.post('/notification/softDelete', notificationController.softDelete)

module.exports = router;