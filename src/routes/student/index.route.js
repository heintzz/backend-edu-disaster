const express = require('express');

const router = express.Router();

router.use('/classes', require('./class.route.js'));
router.use('/evaluations', require('./evaluation.route.js'));
router.use('/progress', require('./progress.route.js'));
router.use('/notes', require('./note.route.js'));

module.exports = router;
