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

const getMaincategory = (req, res) => {
    let queryJSON = generateGetSQL('maincategory', req);
    connect(res, queryJSON);
};

const postMaincategory = (req, res) => {
    let queryJSON = generatePostSQL('maincategory', req);
    connect(res, queryJSON);
};

const putMaincategory = (req, res) => {
    let queryJSON = generatePutSQL('maincategory', req);
    connect(res, queryJSON);
};

const deleteMaincategory = (req, res) => {
    let queryJSON = generateDeleteSQL('maincategory', req);
    connect(res, queryJSON);
};

const getMaincategoryCategory = (req, res) => {
    let params = req.query;
    let maincategoryID = params.maincategory_id;

    if (!maincategoryID) { 
        res.json({error: "Missing maincategory ID"});
        return;
    }

    let query = "SELECT * FROM maincategory_categories JOIN category ON maincategory_categories.category_id = category.category_id WHERE maincategory_id = ?";

    let queryList = [maincategoryID];

    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query(query, queryList, (err, results, fields) => {
        if (!err) {
            res.json({data: results});
        } else {
            console.log(err);
            res.status(400);
            res.json({data: "error"});
        }
        
    });
    connection.end()
};

const postMaincategoryCategory = (req, res) => {
    let queryJSON = generatePostSQL('maincategory_categories', req);
    connect(res, queryJSON);
};

const deleteMaincategoryCategory = (req, res) => {
    let queryJSON = generateDeleteSQL('maincategory_categories', req);
    connect(res, queryJSON);
};

const getMaincategoryExpanded = (req, res) => {
    let query = "SELECT * FROM maincategory LEFT JOIN maincategory_categories ON maincategory.maincategory_id = maincategory_categories.maincategory_id LEFT JOIN category ON maincategory_categories.category_id = category.category_id LEFT JOIN image ON maincategory.image_id = image.image_id";

    let queryJSON = generateGetSQLFromQuery(query, req, false);

    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query(queryJSON.query, queryJSON.queryList, (err, results, fields) => {
        if (!err) {
            res.json({data: cleanResults(results)});
        } else {
            console.log(err);
            res.status(400);
            res.json({data: "error"});
        }
        
    });
    connection.end()
};

const cleanResults = (results) => {

    let previousID = null;
    let cleaned = null;
    let cleanedResults = [];

    for (let i in results) {
        let maincategory = results[i];
        let id = maincategory.maincategory_id;

        if (id != previousID) {

            if (cleaned) {
                cleanedResults.push(cleaned);
            }
            previousID = id;

            cleaned = {};
            cleaned.maincategory_id = maincategory.maincategory_id;
            cleaned.maincategory_name = maincategory.maincategory_name;
            cleaned.maincategory_description = maincategory.maincategory_description;
            cleaned.image_id = maincategory.image_id;
            cleaned.image_source = maincategory.image_source;
            cleaned.image_type_id = maincategory.image_type_id
            cleaned.image_description = maincategory.image_description
            cleaned.image_link = maincategory.image_link
            cleaned.categories = [];
        }

        let row = maincategory;
        if (row.category_id && !cleaned.categories.find(c => c.category_id == row.category_id)) cleaned.categories.push({
            category_id: row.category_id,
            category_name: row.category_name,
            category_description: row.category_description
        });
    }
    cleanedResults.push(cleaned);
    return cleanedResults;
}

module.exports = {getMaincategory, postMaincategory, putMaincategory, deleteMaincategory, getMaincategoryCategory, postMaincategoryCategory, deleteMaincategoryCategory, getMaincategoryExpanded}