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

const getProductExpanded = (req, res) => {
    let query = "SELECT *, image.image_id as product_image_id, product.product_id as product_product_id from product" +
    " LEFT JOIN product_images" +
    " ON product.product_id = product_images.product_id" +
    " LEFT JOIN image" +
    " ON image.image_id = product_images.image_id" +
    " LEFT JOIN category_products" +
    " ON category_products.product_id = product.product_id" +
    " LEFT JOIN category" +
    " ON category_products.category_id = category.category_id" +
    " LEFT JOIN product_manufacturers" +
    " ON product.product_id = product_manufacturers.product_id" +
    " LEFT JOIN manufacturer" +
    " ON product_manufacturers.manufacturer_id = manufacturer.manufacturer_id" +
    " LEFT JOIN event" +
    " ON product.event_id = event.event_id" +
    " LEFT JOIN review" +
    " ON product.product_id = review.product_id";

    let queryJSON = generateGetSQLFromQuery(query, req);

    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query(queryJSON.query, queryJSON.queryList, (err, results, fields) => {
        if (!err) {
            res.json({data: cleanResults(results)});
        } else {
            res.status(400);
            res.json({data: "error"});
        }
        
    });
    connection.end()
}

const cleanResults = (results) => {

    let previousID = null;
    let cleaned = null;
    let cleanedResults = [];

    for (let i in results) {
        let product = results[i];
        let id = product.product_product_id;

        if (id != previousID) {

            if (cleaned) {
                cleanedResults.push(cleaned);
            }
            previousID = id;

            cleaned = {};
            cleaned.product_id = product.product_product_id;
            cleaned.product_name = product.product_name;
            cleaned.product_description = product.product_description;
            cleaned.price = product.price;
            cleaned.discount = product.discount;
            if (product.event_id) {
                cleaned.event = {
                    event_id: product.event_id,
                    event_name: product.event_name,
                    event_description: product.event_description,
                    event_start_date: product.event_start_date,
                    event_end_date: product.event_end_date
                }
            } else {
                cleaned.event = null;
            }
            cleaned.categories = [];
            cleaned.manufacturers = [];
            cleaned.images = [];
            cleaned.reviews = [];
        }
        else {
            let row = product;
            if (row.category_id && !cleaned.categories.find(c => c.category_id == row.category_id)) cleaned.categories.push({
                category_id: row.category_id,
                category_name: row.category_name,
                category_description: row.category_description
            });

            if (row.manufacturer_id && !cleaned.manufacturers.find(m => m.manufacturer_id == row.manufacturer_id)) cleaned.manufacturers.push({
                manufacturer_id: row.manufacturer_id,
                manufacturer_name: row.manufacturer_name
            });

            if (row.product_image_id && !cleaned.images.find(i => i.image_id == row.product_image_id)) cleaned.images.push({
                image_id: row.product_image_id,
                image_source: row.image_source,
                image_type_id: row.image_type_id,
                image_description: row.image_description,
                image_link: row.image_link
            });

            if (row.review_id && !cleaned.reviews.find(r => r.review_id == row.review_id)) cleaned.reviews.push({
                review_id: row.review_id,
                user_id: row.user_id,
                review_rating: row.review_rating,
                review_description: row.review_description,
                review_helpful: row.review_helpful,
                review_not_helpful: row.review_not_helpful
            });
        }
    }
    cleanedResults.push(cleaned);
    return cleanedResults;
}

module.exports = {
    getProduct, postProduct, putProduct, deleteProduct, 
    getProductManufacturer, postProductManufacturer, deleteProductManufacturer, 
    getProductCategory, postProductCategory, deleteProductCategory,
    getProductImage, postProductImage, deleteProductImage,
    getProductExpanded
}