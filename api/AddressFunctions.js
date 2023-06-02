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

const getAddress = (req, res) => {
    let queryJSON = generateGetSQL('address', req);
    connect(res, queryJSON);
};

const postAddress = (req, res) => {
    let queryJSON = generatePostSQL('address', req);
    connect(res, queryJSON);
};

const putAddress = (req, res) => {
    let queryJSON = generatePutSQL('address', req);
    connect(res, queryJSON);
};

const deleteAddress = (req, res) => {
    let queryJSON = generateDeleteSQL('address', req);
    connect(res, queryJSON);
};

module.exports = {getAddress, postAddress, putAddress, deleteAddress}