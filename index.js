const express = require('express');
const ProductFunctions = require('./api/ProductFunctions');

const app = express();

const PORT = 5000;

app.use(express.json());

app.listen(PORT, () => {console.log(`App running in port ${PORT}`)});

app.get('/', (req, res) => {
    let HTML = "<div> <h1>Demo webstore API</h1> </div> <div> <h3>WIP by Aku Laurila</h3> </div>"+
    "<div> <p>An express API for use with a demo webstore.</p> </div>" +
    "<ul> <li><a href='https://akulaurila.com'>Home page</a></li>" +
    "<li><a href='https://github.com/Ka-Q'>GitHub</a></li> </ul>";
    res.send(HTML);
})

// API
app.get('/api', (req, res) => {
    res.json({data: "no path"});
});

// PRODUCT
app.get('/api/product', (req, res) => {
    ProductFunctions.getProduct(req, res);
});
app.post('/api/product', (req, res) => {
    ProductFunctions.postProduct(req, res);
});

module.exports = app;