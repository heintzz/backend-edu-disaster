const express = require('express');
const VerifyMiddleware = require('../../middleware/verify');
const UserProgressController = require('../../controllers/student/progress.controller.js');

const router = express.Router();

router.get('/', VerifyMiddleware.verifyToken, UserProgressController.getProgress);
router.post('/', VerifyMiddleware.verifyToken, UserProgressController.addProgress);

module.exports = router;
