const issueModel = require('./issueModel');
const userModel = require('../user/userModel')
const upvoteModel = require('../upvote/upvoteModel')
const employeeModel = require('../employee/employeeModel')

// CREATE OPERATION
const add = async (req, res) => {
    try {
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
            let existingData = await issueModel.findOne({ title: incomingData.title })

            if (existingData) {
                return res.json({
                    status: 400,
                    success: false,
                    message: "Issue already exists"
                })
            }
            const last = await issueModel.findOne().sort({ autoId: -1 });

            const newAutoId = last ? last.autoId + 1 : 1;
            //SAVE ISSUE
            let issueData = new issueModel({

                autoId: newAutoId,
                title: incomingData.title,
                categoryId: incomingData.categoryId,
                reportedBy: incomingData.reportedBy,
                description: incomingData.description,
                location: incomingData.location,
                media: req.file ? req.file.filename : "",
                aiSeverityScore: incomingData.aiSeverityScore,
                status: "Pending",
                isPublic: true,
                upvotes: 0
            })

            let savedissue = await issueData.save();

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
        console.log(req.user);

        const issueId = req.body?._id;
        const incomingData = req.body;

        if (!issueId) {
            return res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }
        

        //STEP 1: FETCH ISSUE
        const issue = await issueModel.findOne({
            _id: issueId,
            isDelete: false
        });

        if (!issue) {
            return res.json({
                status: 404,
                success: false,
                message: "No such issue exists"
            })
        }

        // ROLE CHECK
        const userType = req.user.userType;  // (Assuming: 1 = Admin, 2 = Employee, 3 = Citizen)

        // EMPLOYEE LOGIC
        if (userType === 2) {

            // STEP 2: Convert user → employee
            const employee = await employeeModel.findOne({
                userId: req.user._id
            });

            if (!employee) {
                return res.json({
                    success: false,
                    message: "Employee not found"
                });
            }

            // STEP 3: ADD YOUR CHECK HERE
            if (
                !issue.assignedTo ||
                issue.assignedTo.toString() !== employee._id.toString()
            ) {
                return res.json({
                    success: false,
                    message: "Not your assigned issue"
                });
            }

            // STEP 4: Allowed updates
            if (incomingData.status) {
                issue.status = incomingData.status;
            }

            if (incomingData.remarks) {
                issue.remarks = incomingData.remarks;
            }

            if (req.file) {
                issue.proofImage = req.file.filename;
            }

        }

        // ADMIN LOGIC (FULL ACCESS)
        else if (userType === 1) {
            if (incomingData.title) { issue.title = incomingData.title }
            if (incomingData.description) { issue.description = incomingData.description }
            if (incomingData.status) { issue.status = incomingData.status }
            if (incomingData.location) { issue.location = incomingData.location }
            if (incomingData.media) { issue.media = incomingData.media }
            if (incomingData.aiSeverityScore) { issue.aiSeverityScore = incomingData.aiSeverityScore }
        }
        // CITIZEN LOGIC (LIMITED)
        else if (userType === 3) {

            // Only allow editing own issue (optional check)
            if (issue.reportedBy.toString() !== req.user._id.toString()) {
                return res.json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            if (incomingData.title) issue.title = incomingData.title;
            if (incomingData.description) issue.description = incomingData.description;
            if (incomingData.media) issue.media = incomingData.media;

        }
        issue.updatedAt = Date.now();

        let savedData = await issue.save();

        return res.json({
            status: 200,
            success: true,
            message: "issue Updated",
            data: savedData
        });

    }
    catch (err) {
        return res.json({
            status: 500,
            success: false,
            message: "ISE: " + err
        })
    }
}

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
