const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const token = req.headers['authorization']
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.json({
                    status: 403,
                    success: false,
                    message: "Unauthorized"
                })
            }
            else {
                req.user = decoded;
                req.decoded = decoded;
                next();          // to pass the control to the next middleware / controller
            }
        })
    } else {
        res.json({
            status: 403,
            success: false,
            message: "Token is required"
        })
    }
}