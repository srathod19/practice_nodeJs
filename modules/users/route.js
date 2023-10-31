const express = require('express');
const router = express.Router();
var conn = require('../../config/database');
const user_model = require('./user_model')
const middleware = require('../../middleware/headerValdator')
const { body, validationResult } = require('express-validator');
const GLOBALS = require('../../config/constants');
const jwt = require('jsonwebtoken');

//signup  
router.post('/signup', body('username').isLength({ min: 1 }),
    body('email').isEmail(),
    body('password').isLength({ min: 4 }), function (req, res) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        } else {
            user_model.singup(req, res);
        }
    })

// Login
router.post('/signin', body('email').isEmail(),
    body('password').isLength({ min: 4 }),
    middleware.validateHeaderToken, function (req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        } else {
            user_model.signin(req, res);
        }
    })


//logout
router.post('/logout', middleware.validateHeaderToken, function (req, res) {


    user_model.logout(req, res);

})

// For creating a new to do.
router.post('/toDoCreate', body('title').isLength({ min: 1 }),
    body('description').isLength({ min: 1 }), middleware.validateHeaderToken, function (req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        } else {
            user_model.toDoCreate(req, res);
        }
    });

// Getting the every to do list .
router.get('/getList', function (req, res) {
    user_model.getList(req, res);
});

//Getting specific to do list by ID.
router.get('/getList/:id', function (req, res) {
    user_model.getList(req, res);

});

// Updating the specific to do item by ID.
router.put('/updateToDo/:id', function (req, res) {
    user_model.updateToDo(req, res);

})

// delete the specific item by ID.
router.delete('/deleteToDo/:id', function (req, res) {
    user_model.deleteToDo(req, res);
})

module.exports = router;


