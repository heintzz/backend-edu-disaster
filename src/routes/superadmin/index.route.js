const { Router } = require('express');

const router = Router();

router.use('/institutions', require('./institution.route'));

module.exports = router;
