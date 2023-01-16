const router = require('express').Router();
const { signUp, signIn } = require('../controllers/userController');

router.route('/signup')
    .post(signUp);

router.route('/signin')
    .post(signIn);

module.exports = router;