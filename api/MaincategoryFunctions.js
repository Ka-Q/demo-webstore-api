require('dotenv').config()
const mysql = require('mysql2');
const { generateGetSQL, generatePostSQL, generatePutSQL, generateDeleteSQL } = require('./SQLGenerators');

const connect = (res, queryJSON) => {
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
}

const getMaincategory = (req, res) => {
    let queryJSON = generateGetSQL('maincategory', req);
    connect(res, queryJSON);
};

const postMaincategory = (req, res) => {
    let queryJSON = generatePostSQL('maincategory', req);
    connect(res, queryJSON);
};

const putMaincategory = (req, res) => {
    let queryJSON = generatePutSQL('maincategory', req);
    connect(res, queryJSON);
};

const deleteMaincategory = (req, res) => {
    let queryJSON = generateDeleteSQL('maincategory', req);
    connect(res, queryJSON);
};

const getMaincategoryCategory = (req, res) => {
    let params = req.query;
    let maincategoryID = params.maincategory_id;

    if (!maincategoryID) { 
        res.json({error: "Missing maincategory ID"});
        return;
    }

    let query = "SELECT * FROM maincategory_categories JOIN category ON maincategory_categories.category_id = category.category_id WHERE maincategory_id = ?";

    let queryList = [maincategoryID];

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

const postMaincategoryCategory = (req, res) => {
    let queryJSON = generatePostSQL('maincategory_categories', req);
    connect(res, queryJSON);
};

const deleteMaincategoryCategory = (req, res) => {
    let queryJSON = generateDeleteSQL('maincategory_categories', req);
    connect(res, queryJSON);
};

module.exports = {getMaincategory, postMaincategory, putMaincategory, deleteMaincategory, getMaincategoryCategory, postMaincategoryCategory, deleteMaincategoryCategory}