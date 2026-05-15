const employeeModel = require('./employeeModel');
const userModel = require('../user/userModel')
const bcrypt = require('bcrypt')
const saltRounds = 10;

require("../category/categoryModel");


// CREATE OPERATION
const add = async (req, res) => {
    try {
        const incomingData = req.body || {};
        let validation = "";
        if (!incomingData.name) validation += 'name is Required';
        if (!incomingData.email) validation += 'email is Required';
        if (!incomingData.password) validation += 'password is Required';
        if (!incomingData.designation) validation += 'designation is Required';
        // if (!incomingData.categoryId) validation += 'department is Required';
        if (!incomingData.phone) validation += 'phone is Required';
        if (!incomingData.address) validation += 'address is Required';
        if (!incomingData.salary) validation += 'salary is Required';

        if (!!validation) {
            res.json({
                status: 400,
                success: false,
                message: validation
            })
        }

        //CHECK IN USER MODEL (NOT IN EMP MODEL)
        let existingData = await userModel.findOne({ email: incomingData.email })

        if (existingData) {
            return res.json({
                status: 400,
                success: false,
                message: "User already exists"
            });
        }

        //CREATE USER
        let newUser = new userModel({
            autoId: await userModel.countDocuments({}) + 1,
            name: incomingData.name,
            email: incomingData.email,
            password: bcrypt.hashSync(incomingData.password, saltRounds),
            phone: incomingData.phone,
            userType: 2,
        });

        let savedUser = await newUser.save();

        let employeeData = new employeeModel({
            autoId: await employeeModel.countDocuments({}) + 1,
            name: incomingData.name,
            email: incomingData.email,
            designation: incomingData.designation,
            status: incomingData.status,
            password: incomingData.password,

            categoryId: incomingData.categoryId,
            phone: incomingData.phone,
            address: incomingData.address,
            salary: incomingData.salary,

            userId: savedUser._id
        })
        let savedEmployee = await employeeData.save();

        res.json({
            status: 201,
            success: true,
            message: "Employee Saved",
            data: savedEmployee
        })
    }
    catch (err) {
        return res.json({
            status: 500,
            success: false,
            message: "Internal Server Error: " + err.message
        })
    }
}


// READ OPERATION
// To GET ALL DOCUMENTS
//Populate = used to 'replace' referenced ObjectId with actual document data for better readability and frontend usability.

const all = async (req, res) => {
    try {
        // Only admin allowed
        if (req.user.userType !== 1) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }
        const allData = await employeeModel.find({ isDelete: false })
            .populate({
                path: "categoryId",
                select: "name"
            })             // to retrive all the documents

        const total = await employeeModel.countDocuments({ isDelete: false });
        res.json({
            status: 200,
            success: true,
            message: "employees loaded successfully",
            total: total,
            data: allData
        })
    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "Internal Server Error: " + err,
        })
    }
}

// To GET SINGLE DOCUMENTS BY ID
const single = async (req, res) => {
    try {
        const employeeId = req.body?._id;

        if (!employeeId) {
            return res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const employee = await employeeModel.findOne({ _id: employeeId, isDelete: false })
            .populate("categoryId", "name");

        if (!employee) {
            return res.json({
                status: 404,
                success: false,
                message: "employee not found"
            })
        } else {
            res.json({
                status: 200,
                success: true,
                message: "employee fetched",
                data: employee
            })
        }
    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "Internal Server Error: " + err,
        })
    }
}

//UPDATE OPERATION
const update = async (req, res) => {
    try {
        // Only Admin allowed
        if (req.user.userType !== 1) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }
        const employeeId = req.body?._id;
        const incomingData = req.body;

        if (!employeeId) {
            return res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const employee = await employeeModel.findOne({ _id: employeeId })
            .populate("categoryId", "name");

        if (!employee) {
            return res.json({
                status: 404,
                success: false,
                message: "No such employee exists"
            })
        }
        else {
            if (incomingData.name) { employee.name = incomingData.name }
            if (incomingData.email) { employee.email = incomingData.email }
            if (incomingData.password) { employee.password = incomingData.password }
            if (incomingData.categoryId) { employee.categoryId = incomingData.categoryId }
            if (incomingData.designation) { employee.designation = incomingData.designation }
            if (incomingData.status) { employee.status = incomingData.status }
            if (incomingData.phone) { employee.phone = incomingData.phone }
            if (incomingData.address) { employee.address = incomingData.address }
            if (incomingData.salary) { employee.salary = incomingData.salary }

            employee.updatedAt = Date.now();

            let savedData = await employee.save();

            res.json({
                status: 200,
                success: true,
                message: "Employee Updated",
                data: savedData
            })
        }
    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "ISE: " + err
        })
    }
}

//SOFT DELETE
const softDelete = async (req, res) => {
    try {
        const employeeId = req.body?._id;

        if (!employeeId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const employee = await employeeModel.findOne({ _id: employeeId })

        if (!employee) {
            res.json({
                status: 404,
                success: false,
                message: "No such employee"
            })
        }

        employee.isDelete = true

        await employee.save()

        res.json({
            status: 200,
            success: true,
            message: "Employee removed"
        })

    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "ISE: " + err.message
        })
    }

}

//GET ALL EMPLOYEES
const allEmployees = async (req, res) => {
    try {
        const data = await employeeModel
            .find({})
            .populate("categoryId", "name");

        res.json({
            success: true,
            data
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};

//GET PROFILE
const profile = async (req, res) => {
    try {
        console.log(req.user);
        console.log("STEP 1");
        console.log("REQ.USER:", req.user);
        console.log("STEP 2");

        const employee = await employeeModel.findOne({
            userId: req.user?._id,
            isDelete: false
        })
            .populate("categoryId", "name");   //for employee dashboard

        console.log("STEP 3");
        console.log(employee);

        return res.json({
            success: true,
            data: employee
        });

    } catch (err) {

        console.log("FULL ERROR:", err);

        return res.json({
            success: false,
            message: err.message
        });
    }
};

//UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const employeeId = req.user._id;

        const updateData = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address
        };

        // IMAGE
        if (req.file) {
            updateData.profileImage = req.file.filename;
        }

        const updatedEmployee =
            await employeeModel.findOneAndUpdate(
                { userId: req.user._id },
                updateData,
                { new: true }
            );

        res.status(200).json({
            success: true,
            data: updatedEmployee
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


module.exports = {
    add,
    all,
    single,
    update,
    softDelete,
    allEmployees,
    profile,
    updateProfile
}
