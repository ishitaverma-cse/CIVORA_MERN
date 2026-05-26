const issueModel = require('./issueModel');
const userModel = require('../user/userModel')
const upvoteModel = require('../upvote/upvoteModel')
const employeeModel = require('../employee/employeeModel')
const notificationModel = require("../notification/notificationModel");
const { upload } = require("../../middleware/multer");

// CREATE OPERATION
const add = async (req, res) => {
    try {

        console.log(req.file);

        // CHECK BLOCK FIRST / USER STATUS
        const { reportedBy } = req.body;
        const user = await userModel.findById(reportedBy);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isBlocked) {
            return res.json({
                success: false,
                blocked: true,
                message: "You are blocked by admin. You cannot report issues."
            });
        }

        //CHECK VALIDATION
        const incomingData = req.body || {};
        let validation = "";
        if (!incomingData.title) validation += 'title is Required';
        if (!incomingData.categoryId) validation += 'categoryId is Required';
        if (!incomingData.reportedBy) validation += 'reportedBy is Required';
        if (!incomingData.description) validation += 'description is Required';
        if (!incomingData.location) validation += 'location is Required';
        if (!req.file) validation += 'media is Required';
        if (!incomingData.aiSeverityScore) validation += 'aiSeverityScore is Required';
        if (!!validation) {
            return res.json({
                status: 400,
                success: false,
                message: validation
            })
        }
        else {
            incomingData.title = incomingData.title.trim().toLowerCase();
            incomingData.location = incomingData.location.trim().toLowerCase();

            //CHECK DUPLICATE
            let existingData = await issueModel.findOne({
                title: incomingData.title,
                location: incomingData.location,
                categoryId: incomingData.categoryId
            })

            if (existingData) {
                return res.json({
                    status: 400,
                    success: false,
                    message: "Issue already exists"
                })
            }
            const last = await issueModel.findOne().sort({ autoId: -1 });

            const newAutoId = last ? last.autoId + 1 : 1;

            let image = 'no_image.jpg'
            try {
                let imageUrl = await upload(req.file.buffer)
                image = imageUrl
            } catch (err) {
                res.json({
                    status: 500,
                    success: false,
                    message: " Failed to upload image in cloud: ", err
                })
            }

            //SAVE ISSUE
            let issueData = new issueModel({
                autoId: newAutoId,
                title: incomingData.title,
                categoryId: incomingData.categoryId,
                reportedBy: incomingData.reportedBy,
                description: incomingData.description,
                location: incomingData.location,
                media: image,
                aiSeverityScore: incomingData.aiSeverityScore,
                status: "Pending",
                isPublic: true,
                upvotes: 0
            })

            let savedissue = await issueData.save();

            // CREATE ADMIN NOTIFICATION (BELL)
            await notificationModel.create({

                issueId: savedissue._id,
                reportedBy: reportedBy,
                isAdmin: true,
                type: "ISSUE_REPORTED",
                status: "Pending",
                message: `New issue reported: ${savedissue.title}`
            });

            res.json({
                status: 201,
                success: true,
                message: "issue Saved",
                data: savedissue
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
        const allData = await issueModel.find({ isDelete: false })
            .populate('categoryId')
            .populate('reportedBy')              // to retrive all the documents
            .populate('assignedTo', 'name')

        const total = await issueModel.countDocuments({ isDelete: false, isActive: true })
            .populate("employeeId", "name")
            .populate("issueId");

        res.json({
            status: 200,
            success: true,
            message: "Issues loaded successfully",
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
        const issueId = req.body?._id;

        if (!issueId) {
            return res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const issue = await issueModel.findOne({ _id: issueId, isDelete: false })

        if (!issue) {
            return res.json({
                status: 404,
                success: false,
                message: "issue not found"
            })
        } else {
            return res.json({
                status: 200,
                success: true,
                message: "issue fetched",
                data: issue
            })
        }
    } catch (err) {
        return res.json({
            status: 500,
            success: false,
            message: "Internal Server Error: " + err,
        })
    }
}

//UPDATE OPERATION
const update = async (req, res) => {
    try {

        console.log("BODY RECEIVED:", req.body);
        console.log("USER:", req.user);

        const issueId = req.body?._id;
        const incomingData = req.body;

        if (!issueId) {
            return res.json({
                status: 400,
                success: false,
                message: "_id is required"
            });
        }

        // FETCH ISSUE
        const issue = await issueModel.findOne({
            _id: issueId,
            isDelete: false
        });

        if (!issue) {
            return res.json({
                status: 404,
                success: false,
                message: "No such issue exists"
            });
        }

        // STORE OLD STATUS
        const oldStatus = issue.status?.toString();

        // ROLE CHECK
        const userType = req.user.userType;

        // ================= EMPLOYEE =================
        if (userType === 2) {

            const employee = await employeeModel.findOne({
                userId: req.user._id
            });

            if (!employee) {
                return res.json({
                    success: false,
                    message: "Employee not found"
                });
            }

            // CHECK ASSIGNED ISSUE
            if (
                !issue.assignedTo ||
                issue.assignedTo.toString() !== employee._id.toString()
            ) {
                return res.json({
                    success: false,
                    message: "Not your assigned issue"
                });
            }

            // UPDATE STATUS
            if (incomingData.status) {
                issue.status = incomingData.status;
            }

            // CLEAR OLD DATA IF NOT RESOLVED
            if (incomingData.status !== "Resolved") {
                issue.remarks = "";
                issue.proofImage = "";
            }

            // UPDATE REMARKS
            if (incomingData.remarks) {
                issue.remarks = incomingData.remarks;
            }

            // UPLOAD PROOF
            if (req.file) {

                try {
                    const proofUrl = await upload(req.file.buffer);

                    issue.proofImage = proofUrl;

                } catch (err) {

                    return res.json({
                        success: false,
                        message: "Proof upload failed"
                    });
                }
            }
        }

        // ================= ADMIN =================
        else if (userType === 1) {

            if (incomingData.title) {
                issue.title = incomingData.title;
            }

            if (incomingData.description) {
                issue.description = incomingData.description;
            }

            if (incomingData.status) {
                issue.status = incomingData.status;
            }

            if (incomingData.location) {
                issue.location = incomingData.location;
            }

            if (incomingData.media) {
                issue.media = incomingData.media;
            }

            if (incomingData.aiSeverityScore) {
                issue.aiSeverityScore = incomingData.aiSeverityScore;
            }
        }

        // ================= CITIZEN =================
        else if (userType === 3) {

            if (issue.reportedBy.toString() !== req.user._id.toString()) {
                return res.json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            if (incomingData.title) {
                issue.title = incomingData.title;
            }

            if (incomingData.location) {
                issue.location = incomingData.location;
            }

            if (incomingData.description) {
                issue.description = incomingData.description;
            }

            if (incomingData.categoryId) {
                issue.categoryId = incomingData.categoryId;
            }

            if (req.file) {

                try {

                    const imageUrl = await upload(req.file.buffer);

                    issue.media = imageUrl;

                } catch (err) {

                    return res.json({
                        success: false,
                        message: "Image upload failed"
                    });
                }
            }
        }

        // UPDATE TIME
        issue.updatedAt = Date.now();

        // SAVE ISSUE
        const savedData = await issue.save();

        // ================= STATUS TRACKING =================
        const newStatus = savedData.status?.toString();

        const statusChanged =
            incomingData.status &&
            oldStatus?.trim() !== newStatus?.trim();

        console.log("OLD STATUS:", oldStatus);
        console.log("NEW STATUS:", newStatus);
        console.log("STATUS CHANGED:", statusChanged);

        if (incomingData.status) {

            try {

                // SAFE USER ID
                const citizenId = issue.reportedBy.toString();

                console.log("CITIZEN ID:", citizenId);

                // ================= ADMIN NOTIFICATION =================
                console.log("ENTERING NOTIFICATION CREATE");

                await notificationModel.create({

                    // autoId:
                    //     await notificationModel.countDocuments({}) + 1,

                    issueId: savedData._id,

                    userId: citizenId,

                    isAdmin: true,

                    type:
                        newStatus === "Resolved"
                            ? "ISSUE_RESOLVED"
                            : "STATUS_UPDATED",

                    status: newStatus,

                    message:
                        `Issue "${savedData.title}" updated to ${newStatus}`,

                    remark:
                        savedData.remarks || "",

                    proofImage:
                        savedData.proofImage || ""

                });

                // ================= USER NOTIFICATION =================
                await notificationModel.create({

                    // autoId:
                    //     await notificationModel.countDocuments({}) + 1,

                    issueId: savedData._id,

                    userId: citizenId,

                    isAdmin: false,

                    type:
                        newStatus === "Resolved"
                            ? "ISSUE_RESOLVED"
                            : "STATUS_UPDATED",

                    status: newStatus,

                    message:
                        `Your issue "${savedData.title}" is now ${newStatus}`,

                    remark:
                        savedData.remarks || "",

                    proofImage:
                        savedData.proofImage || ""

                });

                console.log("✅ Notifications Created");
                console.log("NOTIFICATIONS SAVED SUCCESSFULLY");

            } catch (notifErr) {

                console.log("NOTIFICATION ERROR:", notifErr);

            }
        }

        return res.json({
            status: 200,
            success: true,
            message: "Issue Updated",
            data: savedData
        });

    } catch (err) {

        console.log("UPDATE ERROR:", err);

        return res.json({
            status: 500,
            success: false,
            message: "ISE: " + err.message
        });
    }
};



//SOFT DELETE
const softDelete = async (req, res) => {
    try {
        const issueId = req.body?._id;

        if (!issueId) {
            return res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const issue = await issueModel.findOne({ _id: issueId })

        if (!issue) {
            return res.json({
                status: 404,
                success: false,
                message: "No such issue"
            })
        }

        issue.isDelete = true

        await issue.save()

        return res.json({
            status: 200,
            success: true,
            message: "issue removed"
        })

    } catch (err) {
        return res.json({
            status: 500,
            success: false,
            message: "ISE: " + err.message
        })
    }

}

// GET MY ISSUES
const myIssues = async (req, res) => {
    try {
        const userId = req.body?.reportedBy;

        if (!userId) {
            return res.json({
                status: 400,
                success: false,
                message: "reportedBy is required"
            });
        }

        const data = await issueModel.find({
            reportedBy: userId,
            isDelete: false
        })
            .populate('categoryId')
            .populate('reportedBy')
            .sort({ createdAt: -1 }); // latest first

        return res.json({
            status: 200,
            success: true,
            message: "My issues fetched successfully",
            total: data.length,
            data
        });

    } catch (err) {
        return res.json({
            status: 500,
            success: false,
            message: "ISE: " + err.message
        });
    }
};

// GET PUBLIC ISSUES
const public = async (req, res) => {
    try {
        const formData = req.body || {};

        // force filters
        formData.isPublic = true
        formData.isDelete = false

        // remove status if "All"
        if (formData.status == "All") {
            delete formData.status
        }

        // remove category if empty
        if (!formData.categoryId) {
            delete formData.categoryId;
        }

        // extract user id
        const citizenId = formData.citizenId;
        delete formData.citizenId;

        // get issues
        const data = await issueModel.find(formData)
            .populate('categoryId')
            .populate('reportedBy')
            .sort({ createdAt: -1 })
            .lean();  //needed to modify objects

        //  ADD isUpvoted FIELD
        if (citizenId) {
            const upvotes = await upvoteModel.find({ citizenId });

            const upvotedIssueIds = upvotes.map(u => u.issueId.toString());

            data.forEach(issue => {
                issue.isUpvoted = upvotedIssueIds.includes(issue._id.toString());
            });
        } else {
            // if not logged in
            data.forEach(issue => {
                issue.isUpvoted = false;
            });
        }

        return res.json({
            status: 200,
            success: true,
            message: "Public issues fetched successfully",
            total: data.length,
            data
        });

    } catch (err) {
        return res.json({
            status: 500,
            success: false,
            message: "ISE: " + err.message
        });
    }
};

// GET UNASSIGNED ISSUES
const unassignedIssues = async (req, res) => {
    try {
        const data = await issueModel.find({
            assignedTo: null,
            isDelete: false
        })
            .populate("categoryId", "name")
            .populate("reportedBy", "name");

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

//LATEST ISSUES
const latestIssues = async (req, res) => {
    try {
        const issues = await issueModel
            .find({ isDelete: false })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('categoryId')
            .populate('reportedBy');

        res.json({
            success: true,
            data: issues
        });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

//ASSIGNED ISSUES
const assignedIssues = async (req, res) => {
    try {
        const employee = await employeeModel.findOne({ userId: req.user._id });

        const issues = await issueModel
            .find({ assignedTo: employee._id, isDelete: false })
            .populate("categoryId", "name")
            .populate("reportedBy", "name");

        res.json({
            success: true,
            data: issues
        });

    } catch (err) {
        res.json({
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
    myIssues,
    public,
    unassignedIssues,
    latestIssues,
    assignedIssues,
}
