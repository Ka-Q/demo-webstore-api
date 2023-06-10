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

const getImage = (req, res) => {
    let queryJSON = generateGetSQL('image', req);
    connect(res, queryJSON);
};

const postImage = (req, res) => {
    let queryJSON = generatePostSQL('image', req);
    connect(res, queryJSON);
};

const putImage = (req, res) => {
    let queryJSON = generatePutSQL('image', req);
    connect(res, queryJSON);
};

const deleteImage = (req, res) => {
    let queryJSON = generateDeleteSQL('image', req);
    connect(res, queryJSON);
};

module.exports = {getImage, postImage, putImage, deleteImage}