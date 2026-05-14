const notificationModel = require('./notificationModel');

// CREATE OPERATION
const add = async (req, res) => {
    try {
        const incomingData = req.body || {};
        let validation = "";
        if (!incomingData.issueId) validation += 'issueId is Required';
        if (!incomingData.userId) validation += 'userId is Required';
        if (!incomingData.type) validation += 'type is Required';
        if (!incomingData.message) validation += 'message is Required';

        if (!!validation) {
            res.json({
                status: 400,
                success: false,
                message: validation
            })
        }
        else {
            let existingData = await notificationModel.findOne({
                userId: incomingData.userId
            })

            if (existingData) {
                return res.json({
                    status: 400,
                    success: false,
                    message: "User has already received notification of this issue."
                })
            }

            let notificationData = new notificationModel({
                autoId: await notificationModel.countDocuments({}) + 1,
                issueId: incomingData.issueId,
                userId: incomingData.userId,
                type: incomingData.type,
                message: incomingData.message,
            })
            let savednotification = await notificationData.save();

            res.json({
                status: 201,
                success: true,
                message: "notification Saved",
                data: savednotification
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
        const allData = await notificationModel.find({ isDelete: false });     // to retrive all the documents
        const total = await notificationModel.countDocuments({ isDelete: false });
        res.json({
            status: 200,
            success: true,
            message: "notifications loaded successfully",
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
        const notificationId = req.body?._id;

        if (!notificationId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const notification = await notificationModel.findOne({ _id: notificationId, isDelete: false })

        if (!notification) {
            res.json({
                status: 404,
                success: false,
                message: "notification not found"
            })
        } else {
            res.json({
                status: 200,
                success: true,
                message: "notification fetched",
                data: notification
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
        const notificationId = req.body?._id;
        const incomingData = req.body;

        if (!notificationId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const notification = await notificationModel.findOne({ _id: notificationId });

        if (!notification) {
            res.json({
                status: 404,
                success: false,
                message: "No such notification exists"
            })
        } else {
            if (incomingData.type) { notification.type = incomingData.type }
            if (incomingData.message) { notification.message = incomingData.message }

            notification.updatedAt = Date.now()
            let savedData = await notification.save();

            res.json({
                status: 200,
                success: true,
                message: "notification Updated",
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
        const notificationId = req.body?._id;

        if (!notificationId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const notification = await notificationModel.findOne({ _id: notificationId })

        if (!notification) {
            res.json({
                status: 404,
                success: false,
                message: "No such notification"
            })
        }

        notification.isDelete = true

        await notification.save()

        res.json({
            status: 200,
            success: true,
            message: "notification removed"
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
