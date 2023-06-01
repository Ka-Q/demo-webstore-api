const getProduct = (req, res) => {
    res.json({product_name: 'Test product', price: 2.99});
};

module.exports = getProduct;