const conn = require('../../config/database');
const GLOBALS = require('../../config/constants');
const jwt = require('jsonwebtoken');
var User = {
    // checking if email exist or not
    checkEmail: function (req, res, callback) {
        conn.query(`SELECT COUNT(*) AS cnt FROM tbl_users WHERE email = ?`, req.body.email, function (err, result) {
            // console.log(this.sql);
            // console.log(result[0].cnt);
            // return
            if (result[0].cnt > 0) {
                res.status(200).send({ msg: "Email is already exist", state: "incomplete" });
            } else {
                callback(1);
            }
        })
    },
    // signig up for to do
    singup: function (req, res) {
        User.checkEmail(req, res, function (notExist) {
            if (notExist) {

                const user = {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                }
                jwt.sign({ user }, GLOBALS.secretKey, (err, token) => {

                    var username = req.body.username;
                    var email = req.body.email;
                    var password = req.body.password;


                    conn.query(`INSERT INTO tbl_users (name,token,email,password) VALUES('${username}','${token}','${email}','${password}')`, function (err, result) {
                        if (result.insertId) {

                            res.status(404).send({ "msg": "Singed up successfullly", state: "Complete" })
                        } else {
                            res.status(404).send({ "msg": "Singed up failed", state: "incomplete" })

                        }
                    })
                })
            }
        })
    },
    // login API
    signin: function (req, res) {
        conn.query(`SELECT * FROM tbl_users WHERE email = '${req.body.email}' AND password = '${req.body.password}'`, function (err, result) {
            if (result.length < 0) {
                res.status(404).send({ msg: "This email doesn't exist, please register", state: "incomplete" })
            } else {
                conn.query(`UPDATE tbl_users SET is_login = '1' WHERE user_id = '${result[0].user_id}'`, function () { })
                res.status(200).send({ msg: "Logged in successfully!", state: "Complete" })

            }
        })
    },
    // For log out
    logout: function (req, res) {
        conn.query(`UPDATE tbl_users SET is_login = '0' WHERE token = '${req.token}' AND is_login = '1'`, function (err, result) {
            if (!err) {
                res.status(200).send({ msg: "Logged out", state: "Complete" })
            } else {
                res.status(400).send({ msg: "Some error has occured", state: "incomplete" })
            }
        })

    },
    toDoCreate: function (req, res) {
        conn.query(`SELECT * FROM tbl_users WHERE token = '${req.token}' AND is_login = '1'`, function (err1, getID) {
            if (getID[0].user_id) {
                conn.query(`INSERT INTO tbl_todo_list (user_id,title,description) VALUES('${getID[0].user_id}','${req.body.title}','${req.body.description}')`, function (err, result) {

                    if (!err) {
                        res.status(200).send({ msg: "new to do has been Created", state: "Complete" })
                    } else {
                        res.status(200).send({ msg: "Something went wrong", state: "incomplete" })
                    }
                })
            } else {
                res.status(200).send({ msg: "Something went wrong", state: "incomplete" })
            }

        })
    },
    getList: function (req, res) {

        if (req.params.id) {
            //this query will run if passed id,
            var sql = `SELECT * FROM tbl_todo_list where user_id = '${req.params.id}'`
        } else {
            //this query will run if id not passed ,
            var sql = `SELECT * FROM tbl_todo_list`;
        }
        conn.query(sql, function (err, result) {
            console.log(this.sql);
            if (result.length > 0) {
                res.status(200).send({ msg: "To Do Lists", state: "Complete", results: result });
            } else {
                res.status(404).send({ msg: "Not Found", state: "incomplete" });

            }
        })
    },
    updateToDo: function (req, res) {
        var mainRequest = {};
        if (req.body.title != undefined && req.body.title != '') {
            mainRequest.title = req.body.title;
        }
        if (req.body.description != undefined && req.body.description != '') {
            mainRequest.description = req.body.description;
        }
        conn.query(`UPDATE tbl_todo_list SET ? WHERE user_id = '${req.params.id}'`, mainRequest, function (err, result) {
            if (!err) {
                res.status(200).send({ msg: "ToDo has been  updated successfully", state: "complete" });
            } else {
                res.status(200).send({ msg: "Something went wrong", state: "incomplete" });
            }

        })
    },
    deleteToDo: function (req, res) {
        conn.query(`DELETE FROM tbl_todo_list WHERE user_id = '${req.params.id}'`, function (err, result) {
            if (!err) {
                res.status(200).send({ msg: "Item has been deleted", state: "Complete" });
            } else {
                res.status(200).send({ msg: "Something went wrong", state: "Incomplete" });

            }
        })
    }

}
module.exports = User;