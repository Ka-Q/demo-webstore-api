require('dotenv').config()
const mysql = require('mysql2');

const getWishlist = (req, res) => {
    let params = req.query;
    let keys = Object.keys(params);
    let query = "SELECT * FROM wishlist JOIN product ON product_product_id = product_id WHERE (1=1)";

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

const postToWishlist = (req, res) => {
    let userID = req.body.user_id || req.body.user_user_id;
    let products = req.body.products;

    if (!userID || !products) res.json({error: 'error'})

    let query = "INSERT IGNORE INTO wishlist VALUES ";

    let queryList = [];

    for (let i in products) {
        query += `(?, ?),`;
        queryList.push(userID);
        queryList.push(products[i].product_id || products[i].product_product_id);
    }

    query = query.substring(0, query.length - 1);

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

const deleteFromWishlist = (req, res) => {
    let userID = req.body.user_id || req.body.user_user_id;
    let products = req.body.products;

    if (!userID || !products) res.json({error: 'error'})

    let query = "DELETE FROM wishlist WHERE (1=0)";

    let queryList = [];

    for (let i in products) {
        query += " OR (user_user_id = ? AND product_product_id = ?)";
        queryList.push(userID);
        queryList.push(products[i].product_id || products[i].product_product_id);
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

const deleteWishlist = (req, res) => {
    let userID = req.body.user_id || req.body.user_user_id;
    let products = req.body.products;

    if (!userID || !products) res.json({error: 'error'})

    let query = "DELETE FROM wishlist WHERE (user_user_id = ?)";

    let queryList = [];
    queryList.push(userID);

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



module.exports = {getWishlist, postToWishlist, deleteFromWishlist, deleteWishlist}