const express = require('express');
const VerifyMiddleware = require('../../middleware/verify');
const ProfileController = require('../../controllers/profile.controller');

const router = express.Router();

router.get('/', VerifyMiddleware.verifyToken, ProfileController.getProfile);
router.put('/', VerifyMiddleware.verifyToken, ProfileController.updateProfile);

module.exports = router;
