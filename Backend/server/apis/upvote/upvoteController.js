const upvoteModel = require('./upvoteModel');
const issueModel = require('../issue/issueModel');
const Counter = require('./counterModel')

// CREATE OPERATION
const add = async (req, res) => {
    try {
        const incomingData = req.body || {};
        let validation = "";
        if (!incomingData.issueId) validation += 'issueId is Required';
        if (!incomingData.citizenId) validation += 'citizenId is Required';

        if (!!validation) {
            return res.json({
                status: 400,
                success: false,
                message: validation
            });
        }
        else {
            //CHECK EXISTING UPVOTE
            let existingData = await upvoteModel.findOne({
                issueId: incomingData.issueId,
                citizenId: incomingData.citizenId     //fixed, so that different users CAN upvote.
            });

            //TOGGLE LOGIC
            if (existingData) {
                //  Remove upvote
                await upvoteModel.deleteOne({ _id: existingData._id });

                await issueModel.findByIdAndUpdate(incomingData.issueId, {
                    $inc: { upvotes: -1 }
                });

                const updatedIssue = await issueModel.findById(incomingData.issueId);

                return res.json({
                    status: 200,
                    success: true,
                    message: "Upvote removed",
                    issueId: incomingData.issueId,   
                    upvotes: updatedIssue.upvotes,
                    isUpvoted: false
                });
            }

            // GET UNIQUE autoId (atomic)
            const counter = await Counter.findOneAndUpdate(
                { name: "upvoteId" },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );
            console.log("Counter value:", counter.value);

            //ADD NEW UPVOTE
            let upvoteData = new upvoteModel({
                autoId: counter.value,
                issueId: incomingData.issueId,
                citizenId: incomingData.citizenId,
            });
            let savedupvote = await upvoteData.save();


            // UPDATE ISSUE COUNT
            await issueModel.findByIdAndUpdate(incomingData.issueId, {
                $inc: { upvotes: 1 }
            });

            const updatedIssue = await issueModel.findById(incomingData.issueId);

            return res.json({
                status: 201,
                success: true,
                message: "Upvote added",
                issueId: incomingData.issueId,
                upvotes: updatedIssue.upvotes,
                isUpvoted: true
            });

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
        const allData = await upvoteModel.find({ isDelete: false });     // to retrive all the documents
        const total = await upvoteModel.countDocuments({ isDelete: false });
        res.json({
            status: 200,
            success: true,
            message: "upvotes loaded successfully",
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
        const upvoteId = req.body?._id;

        if (!upvoteId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const upvote = await upvoteModel.findOne({ _id: upvoteId, isDelete: false })

        if (!upvote) {
            res.json({
                status: 404,
                success: false,
                message: "upvote not found"
            })
        } else {
            res.json({
                status: 200,
                success: true,
                message: "upvote fetched",
                data: upvote
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
        const upvoteId = req.body?._id;
        const incomingData = req.body;

        if (!upvoteId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const upvote = await upvoteModel.findOne({ _id: upvoteId });

        if (!upvote) {
            res.json({
                status: 404,
                success: false,
                message: "No such upvote exists"
            })
        } else {
            if (incomingData.status) { upvote.status = incomingData.status }
            if (incomingData.remarks) { upvote.remarks = incomingData.remarks }

            upvote.updatedAt = Date.now()
            let savedData = await upvote.save();

            res.json({
                status: 200,
                success: true,
                message: "upvote Updated",
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
        const upvoteId = req.body?._id;

        if (!upvoteId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const upvote = await upvoteModel.findOne({ _id: upvoteId })

        if (!upvote) {
            res.json({
                status: 404,
                success: false,
                message: "No such upvote"
            })
        }

        upvote.isDelete = true

        await upvote.save()

        res.json({
            status: 200,
            success: true,
            message: "upvote removed"
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
