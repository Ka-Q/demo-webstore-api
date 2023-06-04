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

const getManufacturer = (req, res) => {
    let queryJSON = generateGetSQL('manufacturer', req);
    connect(res, queryJSON);
};

const postManufacturer = (req, res) => {
    let queryJSON = generatePostSQL('manufacturer', req);
    connect(res, queryJSON);
};

const putManufacturer = (req, res) => {
    let queryJSON = generatePutSQL('manufacturer', req);
    connect(res, queryJSON);
};

const deleteManufacturer = (req, res) => {
    let queryJSON = generateDeleteSQL('manufacturer', req);
    connect(res, queryJSON);
};

const getManufacturerProduct = (req, res) => {
    let params = req.query;
    let manufacturerID = params.manufacturer_id;

    if (!manufacturerID) { 
        res.json({error: "Missing manufacturer ID"});
        return;
    }

    let query = "SELECT * FROM product_manufacturers JOIN product ON product_manufacturers.product_id = product.product_id WHERE manufacturer_id = ?";

    let queryList = [manufacturerID];

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

const postManufacturerProduct = (req, res) => {
    let queryJSON = generatePostSQL('product_manufacturers', req);
    connect(res, queryJSON);
};

const deleteManufacturerProduct = (req, res) => {
    let queryJSON = generateDeleteSQL('product_manufacturers', req);
    connect(res, queryJSON);
};

module.exports = {getManufacturer, postManufacturer, putManufacturer, deleteManufacturer, getManufacturerProduct, postManufacturerProduct, deleteManufacturerProduct}