const express = require('express');
const TeacherClassController = require('../../controllers/teacher/class.controller');
const VerifyMiddleware = require('../../middleware/verify');

const router = express.Router();

router.use(VerifyMiddleware.verifyToken, VerifyMiddleware.verifyTeacher);

router.get('/', TeacherClassController.getClasses);
router.post('/', TeacherClassController.createClass);
router.get('/code', TeacherClassController.generateRandomCode);
router.get('/:classId/evaluations', TeacherClassController.getEvaluationsByClassId);

module.exports = router;
