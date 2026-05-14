const userModel = require('./userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const issueModel = require('../issue/issueModel')


//LOGIN USER
const login = async (req, res) => {
    try {
        const incomingData = req.body || {};
        let validation = "";

        if (!incomingData.email) validation += " email is required";
        if (!incomingData.password) validation += " password is required";

        if (!!validation) {
            return res.json({
                status: 400,
                success: false,
                message: "Validation Error:" + validation
            });
        }

        let user = await userModel.findOne({ email: incomingData.email });

        if (!user) {
            return res.json({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        // password 
        let isMatch = bcrypt.compareSync(incomingData.password, user.password);

        if (!isMatch) {
            return res.json({
                status: 401,
                success: false,
                message: "Wrong Password"
            });
        }

        //payload
        let payload = {
            _id: user._id,
            email: user.email,
            userType: user.userType,
            isBlocked: user.isBlocked
        };

        // generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.json({
            status: 200,
            success: true,
            message: "Login Success!!",
            token: token,
            data: payload
        });

    }
    catch (err) {
        res.json({
            status: 500,
            success: false,
            message: err.message
        })
    }
}

//GET ALL CITIZENS + COMPLAINT COUNT
const allCitizens = async (req, res) => {
    try {
        const users = await userModel.find({
            userType: 3
        }).select("-password");

        const usersWithCount = await Promise.all(
            users.map(async (user) => {
                const count = await issueModel.countDocuments({
                    reportedBy: user._id
                });

                return {
                    ...user._doc,
                    complaintCount: count
                };
            })
        );

        res.json({
            status: 200,
            success: true,
            data: usersWithCount
        });

    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: err.message
        })
    }
};

//BLOCK USER (with reason)
const blockUser = async (req, res) => {
    try {
        const { userId, reason } = req.body;

        if (!userId) {
            return res.json({
                success: false,
                message: "UserId is required"
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // TOGGLE LOGIC
        if (!user.isBlocked) {
            // BLOCK
            if (!reason) {
                return res.json({
                    success: false,
                    message: "Reason is required to block user"
                });
            }

            user.isBlocked = true;
            user.blockReason = reason;

        } else {
            // UNBLOCK
            user.isBlocked = false;
            user.blockReason = "";
        }

        await user.save();

        res.json({
            success: true,
            message: user.isBlocked ? "User blocked" : "User unblocked",
            data: user
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    login,
    allCitizens,
    blockUser
}