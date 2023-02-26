const router = require('express').Router();
const { createCategory, getCategories, udpateCategory, deleteCategory, getSingleCategory } = require('../controllers/categoryController');
const authorize = require('../middlewares/authorize');
const admin = require('../middlewares/admin');

router.route('/')
    .post([authorize, admin], createCategory)
    .get(getCategories);

router.route('/:id')
    .put([authorize, admin], udpateCategory)
    .delete([authorize, admin], deleteCategory)
    .get(getSingleCategory);

module.exports = router;