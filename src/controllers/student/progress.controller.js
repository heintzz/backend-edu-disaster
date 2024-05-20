const pool = require('../../config/db');

const getProgress = async (req, res) => {
  const studentId = req.userId;

  const searchStudentQuery = `
    SELECT id, name
    FROM users
    WHERE id = $1`;

  const { rows: studentRows } = await pool.query(searchStudentQuery, [studentId]);

  if (studentRows.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'student not found',
      data: [],
    });
  }

  const searchProgressQuery = `
    SELECT lesson_id, is_completed, completion_date
    FROM progress
    WHERE student_id = $1`;

  try {
    const { rows: progressRows } = await pool.query(searchProgressQuery, [studentId]);

    res.status(200).send({
      success: true,
      message: 'student data retrieved',
      data: progressRows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: null,
    });
  }
};

const addProgress = async (req, res) => {
  const { lessonId } = req.body;
  const studentId = req.userId;

  const searchStudentQuery = `
    SELECT id, name
    FROM users
    WHERE id = $1`;

  const { rows: studentRows } = await pool.query(searchStudentQuery, [studentId]);

  if (studentRows.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'student not found',
      data: [],
    });
  }

  const searchProgressQuery = `
    SELECT lesson_id, is_completed, completion_date
    FROM progress
    WHERE student_id = $1 AND lesson_id = $2`;

  const { rows: progressRows } = await pool.query(searchProgressQuery, [studentId, lessonId]);

  if (progressRows.length > 0) {
    return res.status(200).send({
      success: true,
      message: 'student progress already exists',
      data: progressRows,
    });
  }

  const insertProgressQuery = `
    INSERT into progress (student_id, lesson_id, is_completed)
    VALUES ($1, $2, $3)
    RETURNING id, lesson_id, is_completed
    `;

  try {
    const { rows: insertedRows } = await pool.query(insertProgressQuery, [
      studentId,
      lessonId,
      true,
    ]);

    res.status(201).send({
      success: true,
      message: 'student progress added',
      data: insertedRows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message || 'internal server error',
      data: [],
    });
  }
};

const UserProgressController = {
  getProgress,
  addProgress,
};

module.exports = UserProgressController;
