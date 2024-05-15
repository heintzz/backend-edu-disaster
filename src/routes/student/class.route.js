const express = require('express');
const VerifyMiddleware = require('../../middleware/verify');
const UserClassController = require('../../controllers/student/class.controller');

const router = express.Router();

router.post('/:classCode/join', VerifyMiddleware.verifyToken, UserClassController.joinClass);

module.exports = router;
