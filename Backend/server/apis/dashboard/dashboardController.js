const issueModel = require("../issue/issueModel");

const dashboard = async (req, res) => {
    try {

        const statsAgg = await issueModel.aggregate([
            {
                $match: { isDelete: false }
            },
            {
                $group: {
                    _id: null,

                    total: { $sum: 1 },

                    resolved: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0]
                        }
                    },

                    pending: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Pending"] }, 1, 0]
                        }
                    },

                    inProgress: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0]
                        }
                    },

                    rejected: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const categoryStats = await issueModel.aggregate([
            {
                $match: { isDelete: false }
            },
            {
                $group: {
                    _id: "$categoryId",
                    value: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    name: "$category.name",
                    value: 1
                }
            }
        ]);

        const latestIssues = await issueModel
            .find({ isDelete: false })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("categoryId", "name")
            .populate("reportedBy", "name")
            .populate("assignedTo", "name");

        const counts = statsAgg[0] || {
            total: 0,
            resolved: 0,
            pending: 0,
            inProgress: 0,
            rejected: 0
        };

        res.json({
            success: true,
            status: 200,
            data: {
                counts,
                categoryStats,
                latestIssues
            }
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { dashboard };