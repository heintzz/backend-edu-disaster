const pool = require('../../config/db');
const soal = require('../../utils/soal');

const getEvaluationById = async (req, res) => {
  const evaluationId = req.params.evaluationId;

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
    INSERT INTO evaluations (student_id, class_id, answers)
    VALUES ($1, $2, $3)
    RETURNING id, student_id, score, created_at, updated_at`;

  try {
    const { rows: evaluationRows } = await pool.query(createEvaluationQuery, [
      userId,
      classId,
      {
        data: [],
      },
    ]);

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
  const answers = req.body;
  const studentId = req.userId;

  const saveAnswerQuery = `
    UPDATE evaluations
    SET answers = $1, updated_at = NOW()
    WHERE student_id = $2`;

  try {
    const { rows: answerRows } = await pool.query(saveAnswerQuery, [answers, studentId]);

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

const submitAnswers = async (req, res) => {
  const answers = req.body;
  const studentId = req.userId;

  let score = 0;

  answers.data.forEach((item) => {
    const questionIndex = item.no - 1;
    const userAnswer = item.answer.toUpperCase();
    const correctAnswer = soal[questionIndex].correctAnswer;

    if (userAnswer === correctAnswer) {
      score++;
    }
  });

  score = Math.floor((score / soal.length) * 100);

  const submitAnswerQuery = `
    UPDATE evaluations
    SET answers = $1, is_completed = true, score = $2, updated_at = NOW()
    WHERE student_id = $3
    RETURNING id, student_id, score`;

  try {
    const { rows: answerRows } = await pool.query(submitAnswerQuery, [answers, score, studentId]);

    res.status(200).send({
      success: true,
      message: 'answer submitted',
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
  createEvaluations,
  saveAnswers,
  submitAnswers,
};

module.exports = StudentEvaluationController;
