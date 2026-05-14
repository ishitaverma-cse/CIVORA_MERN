const assignmentModel = require('./assignmentModel');
const issueModel = require('../issue/issueModel');

// CREATE OPERATION
const add = async (req, res) => {
    try {
        const incomingData = req.body || {};
        let validation = "";
        if (!incomingData.issueId) validation += 'issueId is Required';
        if (!incomingData.employeeId) validation += 'employeeId is Required';

        if (!!validation) {
            res.json({
                status: 400,
                success: false,
                message: validation
            })
        }
        else {
            // allow multiple employees, but prevent duplicate same employee
            let existingData = await assignmentModel.findOne({
                issueId: incomingData.issueId,
                employeeId: incomingData.employeeId,
                isActive: true
            });

            if (existingData) {
                return res.json({
                    status: 400,
                    success: false,
                    message: "This issue is already assigned to this employee"
                })
            }


            // create assignment 
            let assignmentData = new assignmentModel({
                autoId: await assignmentModel.countDocuments({}) + 1,
                issueId: incomingData.issueId,
                employeeId: incomingData.employeeId,
                status: incomingData.status || "assigned",
                priority: incomingData.priority || "medium",
            })
            let savedassignment = await assignmentData.save();


// ✅ ADD THIS (VERY IMPORTANT)
await issueModel.findByIdAndUpdate(
    incomingData.issueId,
    { assignedTo: incomingData.employeeId }
);
            res.json({
                status: 201,
                success: true,
                message: "assignment Saved",
                data: savedassignment
            })
        }
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

const all = async (req, res) => {
    try {
        const allData = await assignmentModel.find({ isDelete: false });     // to retrive all the documents
        const total = await assignmentModel.countDocuments({ isDelete: false });
        res.json({
            status: 200,
            success: true,
            message: "assignments loaded successfully",
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
        const assignmentId = req.body?._id;

        if (!assignmentId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const assignment = await assignmentModel.findOne({ _id: assignmentId, isDelete: false })

        if (!assignment) {
            res.json({
                status: 404,
                success: false,
                message: "assignment not found"
            })
        } else {
            res.json({
                status: 200,
                success: true,
                message: "assignment fetched",
                data: assignment
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
        console.log("Update: ", req.body)
        const assignmentId = req.body?._id;
        const incomingData = req.body;

        if (!assignmentId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const assignment = await assignmentModel.findOne({ _id: assignmentId });

        if (!assignment) {
            res.json({
                status: 404,
                success: false,
                message: "No such assignment exists"
            })
        } else {
            if (incomingData.status) { assignment.status = incomingData.status }
            if (incomingData.priority) { assignment.priority = incomingData.priority }

            assignment.updatedAt = Date.now()
            let savedData = await assignment.save();

            res.json({
                status: 200,
                success: true,
                message: "assignment Updated",
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
        const assignmentId = req.body?._id;

        if (!assignmentId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const assignment = await assignmentModel.findOne({ _id: assignmentId })

        if (!assignment) {
            res.json({
                status: 404,
                success: false,
                message: "No such assignment"
            })
        }

        assignment.isDelete = true

        await assignment.save()

        res.json({
            status: 200,
            success: true,
            message: "assignment removed"
        })

    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "ISE: " + err.message
        })
    }

}


module.exports = {
    add,
    all,
    single,
    update,
    softDelete
}
