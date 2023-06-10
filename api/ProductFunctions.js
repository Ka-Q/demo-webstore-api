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

const getProduct = (req, res) => {
    let queryJSON = generateGetSQL('product', req);
    connect(res, queryJSON);
};

const postProduct = (req, res) => {
    let queryJSON = generatePostSQL('product', req);
    connect(res, queryJSON);
};

const putProduct = (req, res) => {
    let queryJSON = generatePutSQL('product', req);
    connect(res, queryJSON);
};

const deleteProduct = (req, res) => {
    let queryJSON = generateDeleteSQL('product', req);
    connect(res, queryJSON);
};

const getProductManufacturer = (req, res) => {
    let params = req.query;
    let productID = params.product_id;

    if (!productID) { 
        res.json({error: "Missing product ID"});
        return;
    }

    let query = "SELECT * FROM product_manufacturers JOIN manufacturer ON product_manufacturers.manufacturer_id = manufacturer.manufacturer_id WHERE product_id = ?";

    let queryList = [productID];

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

const postProductManufacturer = (req, res) => {
    let queryJSON = generatePostSQL('product_manufacturers', req);
    connect(res, queryJSON);
};

const deleteProductManufacturer = (req, res) => {
    let queryJSON = generateDeleteSQL('product_manufacturers', req);
    connect(res, queryJSON);
};

const getProductCategory = (req, res) => {
    let params = req.query;
    let productID = params.product_id;

    if (!productID) { 
        res.json({error: "Missing product ID"});
        return;
    }

    let query = "SELECT * FROM category_products JOIN category ON category_products.category_id = category.category_id WHERE product_id = ?";

    let queryList = [productID];

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

const postProductCategory = (req, res) => {
    let queryJSON = generatePostSQL('category_products', req);
    connect(res, queryJSON);
};

const deleteProductCategory = (req, res) => {
    let queryJSON = generateDeleteSQL('category_products', req);
    connect(res, queryJSON);
};

const getProductImage = (req, res) => {
    let params = req.query;
    let productID = params.product_id;

    if (!productID) { 
        res.json({error: "Missing product ID"});
        return;
    }

    let query = "SELECT * FROM product_images JOIN image ON product_images.image_id = image.image_id WHERE product_id = ?";

    let queryList = [productID];

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

const postProductImage = (req, res) => {
    let queryJSON = generatePostSQL('product_images', req);
    connect(res, queryJSON);
};

const deleteProductImage = (req, res) => {
    let queryJSON = generateDeleteSQL('product_images', req);
    connect(res, queryJSON);
};

module.exports = {
    getProduct, postProduct, putProduct, deleteProduct, 
    getProductManufacturer, postProductManufacturer, deleteProductManufacturer, 
    getProductCategory, postProductCategory, deleteProductCategory,
    getProductImage, postProductImage, deleteProductImage
}