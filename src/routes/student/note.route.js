const express = require('express');
const VerifyMiddleware = require('../../middleware/verify');
const UserNotesController = require('../../controllers/student/note.controller.js');

const router = express.Router();

router.get('/', VerifyMiddleware.verifyToken, UserNotesController.getNotes);

module.exports = router;
