require('dotenv').config()
const mysql = require('mysql2');
const { generateGetSQL, generatePostSQL, generatePutSQL, generateDeleteSQL } = require('./SQLGenerators');
const bcrypt = require('bcryptjs');
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

const getUser = async (req, res) => {
    let queryJSON = generateGetSQL('user', req);
    connect(res, queryJSON);
};

const getPublicUser = async (req, res) => {
    if (!req.query.user_id) {
        res.status(404);
        res.json({data: "error: user does not exist"});
        return 0;
    }

    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query("SELECT * FROM user WHERE ?? = ?", ["user_id", req.query.user_id], (err, results, fields) => {
        if (!err) {
            let returnObject = {
                user_id: results[0].user_id,
                user_username: results[0].user_username,
                image_id: results[0].image_id,
                role_id: results[0].role_id
            }
            res.json({data: returnObject});
        } else {
            console.log(err);
            res.status(400);
            res.json({data: "error"});
        }
    });
    connection.end()
};

const getPublicUserProfile = async (req, res) => {
    if (!req.query.user_id) {
        res.status(404);
        res.json({data: "error: user does not exist"});
        return 0;
    }
    let query = "SELECT user.user_id, user.user_username, user.image_id, user.role_id, review.review_id, review.product_id, review.review_rating, review.review_description, review.review_helpful, review.review_not_helpful FROM user "+
        "LEFT JOIN review ON user.user_id = review.user_id " +
        "WHERE user.user_id = ?";
    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query(query, [req.query.user_id], (err, results, fields) => {
        if (!err) {
            res.json({data: cleanUserProfile(results)});
        } else {
            console.log(err);
            res.status(400);
            res.json({data: "error"});
        }
    });
    connection.end()
};

const cleanUserProfile = (results) => {
    let user = results[0];

    if (!user) return {data: []};
    let cleaned = {}

    cleaned.user_id = user.user_id;
    cleaned.user_username = user.user_username;
    cleaned.image_id = user.image_id;
    cleaned.role_id = user.role_id;

    cleaned.reviews = [];
    for (let row of results) {

        if (row.review_id && !cleaned.reviews.find(r => r.review_id == row.review_id)) cleaned.reviews.push({
            review_id: row.review_id,
            product_id: row.product_id,
            review_rating: row.review_rating,
            review_description: row.review_description,
            review_helpful: row.review_helpful,
            review_not_helpful: row.review_not_helpful
        });
    }
    return cleaned;
}

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
            req.session.user = {
                user_email: user.user_email, 
                user_id: user.user_id, 
                user_username: user.user_username, 
                user_first_name: user.user_first_name, 
                user_last_name: user.user_last_name, 
                role_id: user.role_id}
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
    if (req.session.user) {
        res.status(200);
        res.json(req.session.user);
    } else {
        res.status(400);
        res.json({data: "Not logged in"});
    }
}

const logOut = (req, res) => {
    req.session.destroy();
    res.status(200);
    res.json({data: "Logged out"});
}

module.exports = {getUser, getPublicUser, getPublicUserProfile, postUser, putUser, deleteUser, registerUser, logIn, checkLogIn, logOut}