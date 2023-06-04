require('dotenv').config()
const mysql = require('mysql2');
const { generatePostSQL, generatePutSQL, generateDeleteSQL } = require('./SQLGenerators');

const getCart = (req, res) => {
    let params = req.query;
    let keys = Object.keys(params);
    let query = "SELECT * FROM cart_entry JOIN product ON cart_entry.product_id = product.product_id WHERE (1=1)";

    let queryList = [];

    for (let x in keys) {
        let key = keys[x];
        query += " AND ?? LIKE ?";
        queryList.push(keys[x]);
        queryList.push(params[key]);
    }

    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query(query, queryList, (err, results, fields) => {
        if (!err) {
            res.json({data: results});
        } else {
            res.status(400);
            res.json({data: "error"});
        }
        
    });
    connection.end()
};

const postToCart = (req, res) => {
    
    let queryJSON = generatePostSQL('cart_entry', req);

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
};

const putToCart = (req, res) => {
    
    let queryJSON = generatePutSQL('cart_entry', req);

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
};

const deleteFromCart = (req, res) => {
    
    let queryJSON = generateDeleteSQL('cart_entry', req);

    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query(queryJSON.query, queryJSON.queryList, (err, results, fields) => {
        if (!err) {
            res.json({data: results});
        } else {
            res.status(400);
            res.json({data: "error"});
        }
    });
    connection.end()
};


const deleteCart = (req, res) => {
    let userID = req.body.user_id;

    if (!userID) res.json({error: 'error'})

    let query = "DELETE FROM cart_entry WHERE (user_id = ?)";

    let queryList = [];
    queryList.push(userID);

    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query(query, queryList, (err, results, fields) => {
        if (!err) {
            res.json({data: results});
        } else {
            console.log(err);
            res.status(400);
            res.json({data: "error"});
        }
    });
    connection.end()
};



module.exports = {getCart, postToCart, putToCart, deleteFromCart, deleteCart}