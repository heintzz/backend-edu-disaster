const express = require('express');

const router = express.Router();

router.use('/profile', require('../general/profile.route.js'));
router.use('/classes', require('./class.route.js'));
router.use('/evaluations', require('./evaluation.route.js'));

module.exports = router;
