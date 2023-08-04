require('dotenv').config()

const express = require('express');
const cors = require('cors');
const session = require("express-session");

const mysql = require('mysql2');
const MySQLStore = require('express-mysql-session')(session);

const bcrypt = require('bcrypt');
const saltRounds = 10;

const path = require('path');

const ProductFunctions = require('./api/ProductFunctions');
const ManufacturerFunctions = require('./api/ManufacturerFunctions');
const AddressFunctions = require('./api/AddressFunctions');
const UserFunctions = require('./api/UserFunctions');
const WishlistFunctions = require('./api/WishlistFunctions');
const CartFunctions = require('./api/CartFunctions');
const ReviewFunctions = require('./api/ReviewFunctions');
const CategoryFunctions = require('./api/CategoryFunctions');
const EventFunctions = require('./api/EventFunctions');
const ImageFunctions = require('./api/ImageFunctions');

const app = express();

const PORT = 5000;

app.use(cors());

app.use(express.json());

// USER SESSION
// Options for mysql session store

const dbConnection = mysql.createConnection(process.env.DATABASE_URL);
const sessionStore = new MySQLStore({}, dbConnection);

app.use(session({
    key: "demo_ws_session",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
      secure: false,
      maxAge: 60000 * 30 // 1 min * 30  
    }
}));
 
app.listen(PORT, () => {console.log(`App running in port ${PORT}`)});

// ROOT
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
})

// API
app.get('/api', (req, res) => {
    res.json({data: "no path"});
});

// CATEGORY
app.get('/api/category', (req, res) => {
    CategoryFunctions.getCategory(req, res);
});
app.post('/api/category', (req, res) => {
    CategoryFunctions.postCategory(req, res);
});
app.put('/api/category', (req, res) => {
    CategoryFunctions.putCategory(req, res);
});
app.delete('/api/category', (req, res) => {
    CategoryFunctions.deleteCategory(req, res);
});

// CATEGORY PRODUCTS    requires category_id
app.get('/api/category_product', (req, res) => {
    CategoryFunctions.getCategoryProduct(req, res);
});
app.post('/api/category_product', (req, res) => {
    CategoryFunctions.postCategoryProduct(req, res);
});
app.delete('/api/category_product', (req, res) => {
    CategoryFunctions.deleteCategoryProduct(req, res);
});

// PRODUCT CATEGORIES    requires product_id
app.get('/api/product_category', (req, res) => {
    ProductFunctions.getProductCategory(req, res);
});
app.post('/api/product_category', (req, res) => {
    ProductFunctions.postProductCategory(req, res);
});
app.delete('/api/product_category', (req, res) => {
    ProductFunctions.deleteProductCategory(req, res);
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

//PRODUCT EXPANDED
app.get('/api/product_expanded', (req, res) => {
    ProductFunctions.getProductExpanded(req, res);
});

// PRODUCT MANUFACTURERS    requires product_id
app.get('/api/product_manufacturer', (req, res) => {
    ProductFunctions.getProductManufacturer(req, res);
});
app.post('/api/product_manufacturer', (req, res) => {
    ProductFunctions.postProductManufacturer(req, res);
});
app.delete('/api/product_manufacturer', (req, res) => {
    ProductFunctions.deleteProductManufacturer(req, res);
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

// MANUFACTURER PRODUCTS   requires manufacturer_id
app.get('/api/manufacturer_product', (req, res) => {
    ManufacturerFunctions.getManufacturerProduct(req, res);
});
app.post('/api/manufacturer_product', (req, res) => {
    ManufacturerFunctions.postManufacturerProduct(req, res);
});
app.delete('/api/manufacturer_product', (req, res) => {
    ManufacturerFunctions.deleteManufacturerProduct(req, res);
});

// EVENT
app.get('/api/event', (req, res) => {
    EventFunctions.getEvent(req, res);
});
app.post('/api/event', (req, res) => {
    EventFunctions.postEvent(req, res);
});
app.put('/api/event', (req, res) => {
    EventFunctions.putEvent(req, res);
});
app.delete('/api/event', (req, res) => {
    EventFunctions.deleteEvent(req, res);
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
app.post('/api/register', (req, res) => {
    UserFunctions.registerUser(req, res);
});
app.post('/api/login', (req, res) => {
    UserFunctions.logIn(req, res);
});
app.post('/api/check_login', (req, res) => {
    UserFunctions.checkLogIn(req, res);
});
app.post('/api/logout', (req, res) => {
    UserFunctions.logOut(req, res);
});

// WISHLIST get and delete
app.get('/api/user_wishlist', (req, res) => {
    WishlistFunctions.getWishlist(req, res);
});
app.delete('/api/user_wishlist', (req, res) => {
    WishlistFunctions.deleteWishlist(req, res);
});

// WISHLIST PRODUCTS post and delete
app.post('/api/user_wishlist_product', (req, res) => {
    WishlistFunctions.postToWishlist(req, res);
});
app.delete('/api/user_wishlist_product', (req, res) => {
    WishlistFunctions.deleteFromWishlist(req, res);
});

// CART
app.get('/api/user_cart', (req, res) => {
    CartFunctions.getCart(req, res);
});
app.delete('/api/user_cart', (req, res) => {
    CartFunctions.deleteCart(req, res);
});

//CART ENTRIES post, put and delete
app.post('/api/user_cart_entry', (req, res) => {
    CartFunctions.postToCart(req, res);
});
app.put('/api/user_cart_entry', (req, res) => {
    CartFunctions.putToCart(req, res);
});
app.delete('/api/user_cart_entry', (req, res) => {
    CartFunctions.deleteFromCart(req, res);
});

// REVIEW
app.get('/api/product_review', (req, res) => {
    ReviewFunctions.getReview(req, res);
});
app.post('/api/product_review', (req, res) => {
    ReviewFunctions.postReview(req, res);
});
app.put('/api/product_review', (req, res) => {
    ReviewFunctions.putReview(req, res);
});
app.delete('/api/product_review', (req, res) => {
    ReviewFunctions.deleteReview(req, res);
});

// IMAGE
app.get('/api/image', (req, res) => {
    ImageFunctions.getImage(req, res);
});
app.post('/api/image', (req, res) => {
    ImageFunctions.postImage(req, res);
});
app.put('/api/image', (req, res) => {
    ImageFunctions.putImage(req, res);
});
app.delete('/api/image', (req, res) => {
    ImageFunctions.deleteImage(req, res);
});

// PRODUCT IMAGES requires product_id
app.get('/api/product_image', (req, res) => {
    ProductFunctions.getProductImage(req, res);
});
app.post('/api/product_image', (req, res) => {
    ProductFunctions.postProductImage(req, res);
});
app.delete('/api/product_image', (req, res) => {
    ProductFunctions.deleteProductImage(req, res);
});

module.exports = app;