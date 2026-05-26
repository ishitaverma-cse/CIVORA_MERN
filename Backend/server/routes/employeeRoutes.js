const express = require('express');       
const router = express.Router();
router.use(require('../middleware/tokenChecker'));

const multer = require('multer');


const cloudStorage = multer.memoryStorage();
const cloudUpload = multer({ storage: cloudStorage });



//import
const employeeController = require('../apis/employee/employeeController')
const issueController = require('../apis/issue/issueController')
// const upload = require('../middleware/multer');


// create routes
//EMPLOYEE
router.post('/employee/all', employeeController.all);
router.post('/employee/single', employeeController.single);
router.post('/employee/update', employeeController.update);
router.post('/employee/delete', employeeController.softDelete);
router.post('/employee/profile', employeeController.profile);
router.post('/employee/updateProfile', cloudUpload.single("profileImage"), employeeController.updateProfile);

//ISSUES
router.post('/issue/all', issueController.all);
router.post('/issue/update', cloudUpload.single("proof"), issueController.update);





module.exports = router;


