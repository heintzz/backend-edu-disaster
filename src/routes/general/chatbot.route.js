const express = require('express');
const ChatbotController = require('../../controllers/chatbot.controller');

const router = express.Router();

router.post('/', ChatbotController.requestResponse);

module.exports = router;
