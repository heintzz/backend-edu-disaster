const express = require('express');

const router = express.Router();

router.use('/classes', require('./class.route.js'));
router.use('/profile', require('../general/profile.route.js'));

module.exports = router;
