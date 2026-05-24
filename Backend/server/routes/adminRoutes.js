const express = require('express');            //import express.
const router = express.Router()                //create router ~ used to handle all api's.



// import
const userController = require('../apis/user/userController');
const employeeController = require('../apis/employee/employeeController')
const categoryController = require('../apis/category/categoryController')
const issueController = require('../apis/issue/issueController')
const assignmentController = require('../apis/assignment/assignmentController')
const upvoteController = require('../apis/upvote/upvoteController')
const notificationController = require('../apis/notification/notificationController')
const dashboardController  = require("../apis/dashboard/dashboardController");
const chatbotController = require('../apis/chatBot/chatbotController');


//create route 
//LOGIN & TOKEN (only admin)
router.post('/login', userController.login);
router.post('/sendOtp', userController.sendOtp);
router.post('/resetPassword', userController.resetPassword);
router.post('/allCitizens', userController.allCitizens);
router.post('/blockUser', userController.blockUser);

router.post('/chat', chatbotController.chatbot);



router.use(require('../middleware/tokenChecker'));

//EMPLOYEE (only admin)
router.post('/employee/add', employeeController.add);
router.post('/employee/all', employeeController.all);
router.post('/employee/single', employeeController.single);
router.post('/employee/update', employeeController.update);
router.post('/employee/softDelete', employeeController.softDelete);
router.post('/employee/allEmployees', employeeController.allEmployees);  //to fetch employees in assignment comp.
router.post('/employee/profile', employeeController.profile)

//CATEGORY (only admin)
router.post('/category/add', categoryController.add);
router.post('/category/all', categoryController.all);
router.post('/category/single', categoryController.single);
router.post('/category/update', categoryController.update);
router.post('/category/softDelete', categoryController.softDelete);

//ISSUE 
router.post('/issue/all', issueController.all);
router.post('/issue/single', issueController.single);
router.post('/issue/softDelete', issueController.softDelete);
router.post('/issue/public', issueController.public);
router.post('/issue/unassignedIssues', issueController.unassignedIssues);
router.post('/issue/latestIssues', issueController.latestIssues);
router.post('/issue/assignedIssues', issueController.assignedIssues);


//ASSIGNMENT
router.post('/assignment/add', assignmentController.add);
router.post('/assignment/all', assignmentController.all);
router.post('/assignment/single', assignmentController.single);
router.post('/assignment/update', assignmentController.update);
router.post('/assignment/softDelete', assignmentController.softDelete);

//UPVOTE
router.post('/upvote/all', upvoteController.all);

//NOTIFICATION
router.post('/notification/add', notificationController.add);
router.post('/notification/all', notificationController.all);
router.post('/notification/single', notificationController.single);
router.post('/notification/update', notificationController.update);
router.post('/notification/softDelete', notificationController.softDelete);

router.post('/notification/admin', notificationController.adminNotifications);

// DASHBOARD ROUTE
router.post("/dashboard", dashboardController.dashboard);


module.exports = router;            //export router ~ to use in another file.
