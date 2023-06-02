const express = require('express');
const ProductFunctions = require('./api/ProductFunctions');
const ManufacturerFunctions = require('./api/ManufacturerFunctions');
const AddressFunctions = require('./api/AddressFunctions');
const UserFunctions = require('./api/UserFunctions');

const app = express();

const PORT = 5000;

app.use(express.json());

app.listen(PORT, () => {console.log(`App running in port ${PORT}`)});

// ROOT
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
app.put('/api/product', (req, res) => {
    ProductFunctions.putProduct(req, res);
});
app.delete('/api/product', (req, res) => {
    ProductFunctions.deleteProduct(req, res);
});

// MANUFACTURER
app.get('/api/manufacturer', (req, res) => {
    ManufacturerFunctions.getManufacturer(req, res);
});
app.post('/api/manufacturer', (req, res) => {
    ManufacturerFunctions.postManufacturer(req, res);
});
app.put('/api/manufacturer', (req, res) => {
    ManufacturerFunctions.putManufacturer(req, res);
});
app.delete('/api/manufacturer', (req, res) => {
    ManufacturerFunctions.deleteManufacturer(req, res);
});

// ADDRESS
app.get('/api/address', (req, res) => {
    AddressFunctions.getAddress(req, res);
});
app.post('/api/address', (req, res) => {
    AddressFunctions.postAddress(req, res);
});
app.put('/api/address', (req, res) => {
    AddressFunctions.putAddress(req, res);
});
app.delete('/api/address', (req, res) => {
    AddressFunctions.deleteAddress(req, res);
});

// USER
app.get('/api/user', (req, res) => {
    UserFunctions.getUser(req, res);
});
app.post('/api/user', (req, res) => {
    UserFunctions.postUser(req, res);
});
app.put('/api/user', (req, res) => {
    UserFunctions.putUser(req, res);
});
app.delete('/api/user', (req, res) => {
    UserFunctions.deleteUser(req, res);
});

module.exports = app;