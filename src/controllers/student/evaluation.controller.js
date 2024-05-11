const pool = require('../../config/db');

const getEvaluationById = async (req, res) => {
  const evaluationId = req.params.evaluationId;
  console.log(evaluationId);

  const searchEvaluationQuery = `
    SELECT id, answers, is_completed, score
    FROM evaluations
    WHERE id = $1`;

  try {
    const { rows: evaluationRows } = await pool.query(searchEvaluationQuery, [evaluationId]);

    if (evaluationRows.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'evaluation not found',
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: 'evaluation detail',
      data: evaluationRows[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const getEvaluations = async (req, res) => {
  const userId = req.userId;
  console.log(userId);

  const searchEvaluationQuery = `
    SELECT id, answers, is_completed, score
    FROM evaluations
    WHERE student_id = $1`;

  try {
    const { rows: evaluationRows } = await pool.query(searchEvaluationQuery, [userId]);

    res.status(200).send({
      success: true,
      message: 'evaluation list',
      data: evaluationRows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const createEvaluations = async (req, res) => {
  const userId = req.userId;
  const classId = req.query.class_id;

  const searchEvaluationQuery = `
    SELECT id, student_id, class_id
    FROM evaluations
    WHERE student_id = $1 AND class_id = $2`;

  const { rows: searchEvaluation } = await pool.query(searchEvaluationQuery, [userId, classId]);

  if (searchEvaluation.length > 0) {
    return res.status(400).send({
      success: false,
      message: 'cannot create evaluation for the same class twice',
      data: searchEvaluation[0],
    });
  }

  const createEvaluationQuery = `
    INSERT INTO evaluations (student_id, class_id)
    VALUES ($1, $2)
    RETURNING id, student_id, score, created_at, updated_at`;

  try {
    const { rows: evaluationRows } = await pool.query(createEvaluationQuery, [userId, classId]);

    res.status(200).send({
      success: true,
      message: 'evaluation created',
      data: evaluationRows[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const saveAnswers = async (req, res) => {
  const evaluationId = req.params.evaluationId;
  const answers = req.body;

  const saveAnswerQuery = `
    UPDATE evaluations
    SET answers = $1, updated_at = NOW()
    WHERE id = $2`;

  try {
    const { rows: answerRows } = await pool.query(saveAnswerQuery, [answers, evaluationId]);

    res.status(200).send({
      success: true,
      message: 'answer saved',
      data: answerRows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const StudentEvaluationController = {
  getEvaluations,
  getEvaluationById,
  saveAnswers,
  createEvaluations,
};

module.exports = StudentEvaluationController;
