const express = require('express');

const router = express.Router();

router.use('/classes', require('./class.route.js'));
router.use('/students', require('./student.route.js'));

module.exports = router;
