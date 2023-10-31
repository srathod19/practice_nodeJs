const jwt = require('jsonwebtoken');
const GLOBALS = require('../config/constants');
var conn = require('../config/database');
const headerValidator = {

    validateHeaderToken: function (req, res, callback) {
        const token = req.headers['token'];
        if (!token) {
            res.status(401).send({ success: false, msg: "Token is required for authentication ." })
        } else {
            const decode = jwt.verify(token, GLOBALS.secretKey);
            req.user = decode;
            req.token = token;
        }
        callback();
    },

};
module.exports = headerValidator;