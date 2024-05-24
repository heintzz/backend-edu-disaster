const express = require('express');
const TeacherStudentController = require('../../controllers/teacher/student.controller');
const VerifyMiddleware = require('../../middleware/verify');

const router = express.Router();

router.use(VerifyMiddleware.verifyToken, VerifyMiddleware.verifyTeacher);

router.get('/', TeacherStudentController.getStudentsByTeacherId);
router.get('/:studentId/progress', TeacherStudentController.getStudentProgress);
router.get('/:studentId/evaluations', TeacherStudentController.getStudentEvaluations);
router.get('/statistics', TeacherStudentController.getStudentStatistics);
router.get('/statistics/answers', TeacherStudentController.getAnswerStatistics);

module.exports = router;
