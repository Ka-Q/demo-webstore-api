require('dotenv').config()
const mysql = require('mysql2');
const { generateGetSQL, generatePostSQL, generatePutSQL, generateDeleteSQL, generateGetSQLFromQuery } = require('./SQLGenerators');

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

const getCategory = (req, res) => {
    let queryJSON = generateGetSQL('category', req);
    connect(res, queryJSON);
};

const getCategoryExpanded = (req, res) => {

    let query = "SELECT * FROM category LEFT JOIN image ON category.image_id = image.image_id";

    let queryJSON = generateGetSQLFromQuery(query, req);
    connect(res, queryJSON);
};

const postCategory = (req, res) => {
    let queryJSON = generatePostSQL('category', req);
    connect(res, queryJSON);
};

const putCategory = (req, res) => {
    let queryJSON = generatePutSQL('category', req);
    connect(res, queryJSON);
};

const deleteCategory = (req, res) => {
    let queryJSON = generateDeleteSQL('category', req);
    connect(res, queryJSON);
};

const getCategoryProduct = (req, res) => {
    let params = req.query;
    let categoryID = params.category_id;

    if (!categoryID) { 
        res.json({error: "Missing category ID"});
        return;
    }

    let query = "SELECT * FROM category_products JOIN product ON category_products.product_id = product.product_id WHERE category_id = ?";

    let queryList = [categoryID];

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

const postCategoryProduct = (req, res) => {
    let queryJSON = generatePostSQL('category_products', req);
    connect(res, queryJSON);
};

const deleteCategoryProduct = (req, res) => {
    let queryJSON = generateDeleteSQL('category_products', req);
    connect(res, queryJSON);
};

module.exports = {getCategory, getCategoryExpanded, postCategory, putCategory, deleteCategory, getCategoryProduct, postCategoryProduct, deleteCategoryProduct}