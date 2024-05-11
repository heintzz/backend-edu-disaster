const express = require('express');

const router = express.Router();

router.use('/users', require('./user.route.js'));

module.exports = router;
