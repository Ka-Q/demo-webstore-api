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

const getReview = (req, res) => {
    let queryJSON = generateGetSQL('review', req);
    connect(res, queryJSON);
};

const postReview = (req, res) => {
    let queryJSON = generatePostSQL('review', req);
    connect(res, queryJSON);
};

const putReview = (req, res) => {
    let queryJSON = generatePutSQL('review', req);
    connect(res, queryJSON);
};

const deleteReview = (req, res) => {
    let queryJSON = generateDeleteSQL('review', req);
    connect(res, queryJSON);
};

module.exports = {getReview, postReview, putReview, deleteReview}