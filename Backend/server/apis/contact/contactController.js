const Contact = require("./contactModel");
const add = async (req, res) => {

    try {
        const {
            name,
            email,
            subject,
            message
        } = req.body;

        if (!name || !email || !subject || !message) {

            return res.send({
                success: false,
                message: "All fields are required"
            });
        }

        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        await contact.save();

        res.send({
            success: true,
            message: "Message sent successfully"
        });

    } catch (err) {

        console.log(err);

        res.send({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    add
};