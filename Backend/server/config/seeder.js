const userModal = require('../apis/user/userModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;

//SEEDER INSERTS DEFAULT DATA AUTOMATICALLY
const seed = async () => {
    try {
        let existingAdmin = await userModal.findOne({ email: "admin@gmail.com" })

        if (!!existingAdmin) {
            console.log("Admin already exists");
            return;
        } else {
            let newAdmin = new userModal({
                name: "Admin",
                email: "admin@gmail.com",
                phone: "1234567890",
                password: bcrypt.hashSync('123', saltRounds),
                userType: 1
            })

            await newAdmin.save();

            console.log("Admin Created");
        }
    } catch (err) {
        console.log("Error seeding: ", err)
    }
}


module.exports = {seed};