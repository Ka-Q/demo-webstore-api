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

const getEvent = (req, res) => {
    let queryJSON = generateGetSQL('event', req);
    connect(res, queryJSON);
};

const postEvent = (req, res) => {
    let queryJSON = generatePostSQL('event', req);
    connect(res, queryJSON);
};

const putEvent = (req, res) => {
    let queryJSON = generatePutSQL('event', req);
    connect(res, queryJSON);
};

const deleteEvent = (req, res) => {
    let queryJSON = generateDeleteSQL('event', req);
    connect(res, queryJSON);
};

module.exports = {getEvent, postEvent, putEvent, deleteEvent}