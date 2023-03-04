const router = require('express').Router();
const { signUp, signIn, changePassword } = require('../controllers/userController');
const authorize = require('../middlewares/authorize');

router.route('/signup')
    .post(signUp);

router.route('/signin')
    .post(signIn);

router.route('/change-password')
    .post(authorize, changePassword);

module.exports = router;
