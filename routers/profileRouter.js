const router = require('express').Router();
const { getProfile, setProfile } = require('../controllers/profileController');
const authorize = require('../middlewares/authorize');

router.route('/')
    .get(authorize, getProfile)
    .post(authorize, setProfile);

module.exports = router;