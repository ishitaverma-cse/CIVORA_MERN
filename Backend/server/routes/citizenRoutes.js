const express = require('express')
const router = express.Router() 
const upload = require("../middleware/multer");

//import
const CitizenController = require('../apis/citizen/citizenController')
const issueController = require('../apis/issue/issueController')
const upvoteController = require('../apis/upvote/upvoteController')



//create routes
//REGISTER
router.post('/register', CitizenController.register);

//ISSUE
router.post('/issue/add', upload.single("media"), issueController.add);
router.post('/issue/all', issueController.all);
router.post('/issue/single', issueController.single);
router.post('/issue/update', issueController.update);
router.post('/issue/softDelete', issueController.softDelete);
router.post('/issue/my', issueController.myIssues);
router.post('/issue/public', issueController.public);

//UPVOTE
router.post('/upvote/add', upvoteController.add);
router.post('/upvote/all', upvoteController.all);
router.post('/upvote/single', upvoteController.single);
router.post('/upvote/softDelete', upvoteController.softDelete);





module.exports = router;