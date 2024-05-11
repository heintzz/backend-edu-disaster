const express = require('express');
const VerifyMiddleware = require('../../middleware/verify');
const StudentEvaluationController = require('../../controllers/student/evaluation.controller');

const router = express.Router();

router.use(VerifyMiddleware.verifyToken);

router.get('/', StudentEvaluationController.getEvaluations);
router.get('/:evaluationId', StudentEvaluationController.getEvaluationById);
router.post('/', StudentEvaluationController.createEvaluations);
router.put('/:evaluationId/answers', StudentEvaluationController.saveAnswers);

module.exports = router;
