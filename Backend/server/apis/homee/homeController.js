const issueModel = require("../issue/issueModel");
const userModel = require("../user/userModel");
const categoryModel = require("../category/categoryModel");

const homeStats = async (req, res) => {

    try {

        const totalIssues = await issueModel.countDocuments({
            isDelete: false
        });

        const resolvedIssues = await issueModel.countDocuments({
            status: "Resolved",
            isDelete: false
        });

        const activeCitizens = await userModel.countDocuments({
            userType: 3,
            isDelete: false
        });

        const departments = await categoryModel.countDocuments({
            isDelete: false
        });

        res.json({
            success: true,
            data: {
                totalIssues,
                resolvedIssues,
                activeCitizens,
                departments
            }
        });

    } catch (err) {

        res.json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    homeStats
};