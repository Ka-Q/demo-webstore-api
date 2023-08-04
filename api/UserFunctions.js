require('dotenv').config()
const mysql = require('mysql2');
const { generateGetSQL, generatePostSQL, generatePutSQL, generateDeleteSQL } = require('./SQLGenerators');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const connect = (res, queryJSON) => {
    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query(queryJSON.query, queryJSON.queryList, (err, results, fields) => {
        if (!err) {
            res.json({data: results});
        } else {
            console.log(err);
            res.status(400);
            res.json({data: "error"});
        }
    });
    connection.end()
}

const getUser = (req, res) => {
    let queryJSON = generateGetSQL('user', req);
    connect(res, queryJSON);
};

const postUser = (req, res) => {
    let queryJSON = generatePostSQL('user', req);
    connect(res, queryJSON);
};

const putUser = (req, res) => {
    let queryJSON = generatePutSQL('user', req);
    connect(res, queryJSON);
};

const deleteUser = (req, res) => {
    let queryJSON = generateDeleteSQL('user', req);
    connect(res, queryJSON);
};

const registerUser = async (req, res) => {
    if (!req.body.user_email || !req.body.user_password){
        res.status(400);
        res.json({data: "error: missing registration data"});
        return 0;
    }

    let email = req.body.user_email;

    let user = await getUserOnEmail(email);
    if (user) {
        res.status(400);
        res.json({data: "error: user with email already exists"});
    } else {
        const userPassword = req.body.user_password;
        const encryptedPassword = await bcrypt.hash(userPassword, saltRounds);
        const user = {
            user_email: req.body.user_email,
            user_password: encryptedPassword,
            user_first_name: req.body.user_first_name,
            user_last_name: req.body.user_last_name,
            role_id: 3
        }
        let queryJSON = generatePostSQL('user', {body: user});
        connect(res, queryJSON);
    }
}

const logIn = async (req, res) => {
    let email = req.body.user_email;
    let password = req.body.user_password;

    if (!req.body.user_email || !req.body.user_password){
        res.status(400);
        res.json({data: "error: missing login data"});
        return 0;
    }

    let user = await getUserOnEmail(email);
    if (user) {
        const comparison = await bcrypt.compare(password, user.user_password.toString());
        if (comparison) {
            req.session.user = {user_email: user.user_email, user_id: user.user_id, role_id: user.role_id}
            req.session.save()
            res.status(200);
            res.json({data: "Logged in"});
        } else {
            req.session.user = {}
            req.session.save()
            res.status(400);
            res.json({data: "error logging in"});
            
        }
    } else {
        res.status(400);
        res.json({data: "error logging in"});
    }
}

// Returns a user based on email. If no user, returns null
const getUserOnEmail = (email) => {
    return new Promise(resolve => {
        const connection = mysql.createConnection(process.env.DATABASE_URL)
        connection.query("SELECT * FROM user WHERE ?? = ?", ['user_email', email], (err, results, fields) => {
            if (!err) {
                if (results.length > 0){
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            } else {
                console.log(err);
                resolve(null);
            }
        });
        connection.end()
    });
}

const checkLogIn = (req, res) => {
    console.log(req.session.user);
    if (req.session.user) {
        res.status(200);
        res.json(req.session.user);
    } else {
        res.status(400);
        res.json({data: "Not logged in"});
    }
}

const logOut = (req, res) => {
    console.log('logging out...')
    req.session.destroy();
    res.status(200);
    res.json({data: "Logged out"});
}

module.exports = {getUser, postUser, putUser, deleteUser, registerUser, logIn, checkLogIn, logOut}