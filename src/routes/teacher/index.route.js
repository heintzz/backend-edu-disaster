const express = require('express');

const router = express.Router();

router.use('/classes', require('./class.route.js'));

module.exports = router;
