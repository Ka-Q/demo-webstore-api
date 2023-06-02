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

module.exports = {getUser, postUser, putUser, deleteUser}