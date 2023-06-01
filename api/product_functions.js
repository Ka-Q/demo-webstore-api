require('dotenv').config()
const mysql = require('mysql2')

const connect = async (res, table) => {
    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.execute(`select * from ${table}`, (err, results, fields) => {
        if (!err) {
            res.json({data: results});
        } else {
            res.status(400);
            res.json({data: "error"});
        }
        
    });
    connection.end()
}

const getProduct = async (req, res) => {
    connect(res, 'product');
};

module.exports = getProduct;