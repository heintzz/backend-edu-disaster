const express = require('express');
const AuthController = require('../../controllers/auth.controller');
const VerifyMiddleware = require('../../middleware/verify');

const router = express.Router();

router.post('/signup', AuthController.Signup);
router.post('/login', AuthController.Login);
router.get('/logout', VerifyMiddleware.verifyToken, AuthController.Logout);

module.exports = router;
