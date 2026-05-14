const categoryModel = require('./categoryModel');

// CREATE OPERATION
const add = async (req, res) => {
    try {
        console.log()
        const incomingData = req.body || {};
        let validation = "";
        if (!incomingData.name) validation += 'name is Required';
        if (!incomingData.description) validation += 'description is Required';
        if (!!validation) {
            res.json({
                status: 400,
                success: false,
                message: validation
            })
        }
        else {
            let existingData = await categoryModel.findOne({ name: incomingData.name })

            if (existingData) {
                return res.json({
                    status: 400,
                    success: false,
                    message: "category already exists"
                })
            }

            let categoryData = new categoryModel({
                autoId: await categoryModel.countDocuments({}) + 1,
                name: incomingData.name,
                description: incomingData.description,
            })
            let savedcategory = await categoryData.save();

            res.json({
                status: 201,
                success: true,
                message: "category Saved",
                data: savedcategory
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
        const allData = await categoryModel.find({ isDelete: false });     // to retrive all the documents
        const total = await categoryModel.countDocuments({ isDelete: false });
        res.json({
            status: 200,
            success: true,
            message: "categorys loaded successfully",
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
        const categoryId = req.body?._id;

        if (!categoryId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const category = await categoryModel.findOne({ _id: categoryId, isDelete: false })

        if (!category) {
            res.json({
                status: 404,
                success: false,
                message: "category not found"
            })
        } else {
            res.json({
                status: 200,
                success: true,
                message: "category fetched",
                data: category
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
        console.log("Update: ", req.body)  //debug
        const categoryId = req.body?._id;
        const incomingData = req.body;

        if (!categoryId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const category = await categoryModel.findOne({ _id: categoryId });

        if (!category) {
            res.json({
                status: 404,
                success: false,
                message: "No such category exists"
            })
        } else {
            if (incomingData.name) { category.name = incomingData.name }
            if (incomingData.description) { category.description = incomingData.description }
            if (incomingData.status !== undefined) { category.status = incomingData.status }  // REMEMBER

            category.updatedAt = Date.now()
            let savedData = await category.save();

            res.json({
                status: 200,
                success: true,
                message: "category Updated",
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
        const categoryId = req.body?._id;

        if (!categoryId) {
            res.json({
                status: 400,
                success: false,
                message: "_id is required"
            })
        }

        const category = await categoryModel.findOne({ _id: categoryId })

        if (!category) {
            res.json({
                status: 404,
                success: false,
                message: "No such category"
            })
        }

        category.isDelete = true

        await category.save()

        res.json({
            status: 200,
            success: true,
            message: "category removed"
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
