const router = require('express').Router();
const { createProduct, getProducts, productDetails, getProductPhoto, updateProduct, deleteProduct, filterProducts } = require('../controllers/productController');
const authorize = require('../middlewares/authorize');
const admin = require('../middlewares/admin');

router.route('/')
    .get(getProducts)
    .post([authorize, admin], createProduct);

router.route('/:id')
    .get(productDetails)
    .put([authorize, admin], updateProduct)
    .delete([authorize, admin], deleteProduct);

router.route('/photo/:id')
    .get(getProductPhoto);

router.route('/filter')
    .post(filterProducts);

module.exports = router;