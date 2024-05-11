const { Router } = require('express');

const router = Router();

router.use('/institutions', require('./institution.route'));
router.use('/profile', require('../general/profile.route.js'));

module.exports = router;
