const express = require('express');
const ProductFunctions = require('./api/ProductFunctions');

const app = express();

const PORT = 5000;

app.use(express.json());

app.listen(PORT, () => {console.log(`App running in port ${PORT}`)});

app.get('/', (req, res) => {
    res.json({data: "error"});
})

app.get('/api', (req, res) => {
    res.json({data: "no path"});
})

app.get('/api/product', (req, res) => {
    ProductFunctions.getProduct(req, res);
})

app.post('/api/product', (req, res) => {
    ProductFunctions.postProduct(req, res);
})

module.exports = app;