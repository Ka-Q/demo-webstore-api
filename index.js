const express = require('express');
const getProduct = require('./api/product_functions');

const app = express();

const PORT = 5000;

app.listen(PORT, () => {console.log(`App running in port ${PORT}`)});

app.get('/', (req, res) => {
    res.json({data: "error"});
})

app.get('/api', (req, res) => {
    res.json({data: "no path"});
})

app.get('/api/product', (req, res) => {
    getProduct(req, res);
})

module.exports = app;