const userModel = require('./userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const issueModel = require('../issue/issueModel')
const { Resend } = require('resend');


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

//SEND OTP
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({
                success: false,
                message: "Email is required"
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }
        // GENERATE OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        user.resetOtp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;
        await user.save();
        
        // SEND MAIL
        // console.log("Emial: ", process.env.EMAIL)
        // console.log("Password: ", process.env.EMAIL_PASSWORD)

        const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "CIVORA Password Reset OTP",
    html: `
        <h2>CIVORA Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
    `
});

        res.json({
            status: 200,
            success: true,
            message: "OTP sent successfully!!"
        })


    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: err.message
        })
    }
}

//RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            newPassword,
            confirmPassword
        } = req.body;

        if (
            !email ||
            !otp ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.json({
                success: false,
                message: "All fields required"
            });
        }

        if (newPassword !== confirmPassword) {

            return res.json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {

            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // OTP CHECK
        if (user.resetOtp !== otp) {

            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // EXPIRY CHECK
        if (user.otpExpire < Date.now()) {

            return res.json({
                success: false,
                message: "OTP expired"
            });
        }

        // HASH PASSWORD
        const hashedPassword = bcrypt.hashSync(
            newPassword,
            10
        );

        user.password = hashedPassword;

        user.resetOtp = null;
        user.otpExpire = null;

        await user.save();

        res.json({
            success: true,
            message: "Password reset successful"
        });

    } catch (err) {

        res.json({
            success: false,
            message: err.message
        });
    }
};

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
    blockUser,
    sendOtp,
    resetPassword
}