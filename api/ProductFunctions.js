require('dotenv').config()
const mysql = require('mysql2');
const { generateGetSQL, generatePostSQL } = require('./SQLGenerators');

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

const getProduct = (req, res) => {
    let queryJSON = generateGetSQL('product', req);
    connect(res, queryJSON);
};

const postProduct = (req, res) => {
    let queryJSON = generatePostSQL('product', req);
    connect(res, queryJSON);
};

module.exports = {getProduct, postProduct}