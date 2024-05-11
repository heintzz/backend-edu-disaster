const express = require('express');
const AuthController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/signup', AuthController.Signup);
router.post('/login', AuthController.Login);

module.exports = router;
