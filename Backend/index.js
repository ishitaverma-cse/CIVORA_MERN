const express = require('express');
const app = express();

//import seeder
const seeder = require('./server/config/seeder')
seeder.seed()

//import cors -> for integrating backend to frontend
const cors = require('cors')
app.use(cors());

app.use(express.static("server/uploads"))

app.use(express.urlencoded());
app.use(express.json());              
           
require('dotenv').config();          //env -> process.env

//multer folder becomes publicly accessible via URL
app.use("/uploads", require("express").static("uploads"));

//calling .env
const port = process.env.PORT                    
console.log("PORT: ", process.env.PORT);
console.log("DB: ", process.env.DB);


//connection to DB
const connectDB = require('./server/config/db')            //import mongoDB
connectDB();

//routes import
const AdminRoutes = require('./server/routes/adminRoutes')     //import admin router
app.use('/admin', AdminRoutes);                                  //Express match '/api' path / stating point → sends request to apiRoutes.

const CitizenRoutes = require('./server/routes/citizenRoutes')      //import citizen router
app.use('/citizen', CitizenRoutes);   

const EmployeeRoutes = require('./server/routes/employeeRoutes')    //import employee routes
app.use('/employee', EmployeeRoutes)


//default route
app.get('/', (req, res) => {                                //HTTP GET request(endpoint, (incoming request/data from user, response you send back)).
    res.send("Welcome to Server!!!!")                      // Sends response to client ~ POSTMAN ~ used for api testing, as we are not using Frontend yet.
})

//for app listening
app.listen(port, () => {
    console.log(`I am listening to port ${port}`)
})


// authentication - who i am - login
// authorization - what can i do 