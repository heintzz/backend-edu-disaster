const pool = require('../../config/db');

const getStudentsByTeacherId = async (req, res) => {
  const classId = req.query.class_id;
  const searchQuery = req.query.search;

  const values = [req.userId];

  let getStudentsQuery = `
      SELECT u.id, u.name, u.email
      FROM users u
      JOIN students_classes sc
      ON u.id = sc.student_id
      JOIN classes c
      ON sc.class_id = c.id
      WHERE c.teacher_id = $1
      `;

  if (classId) {
    getStudentsQuery += ` AND c.id = $${values.length + 1}`;
    values.push(classId);
  }

  if (searchQuery) {
    getStudentsQuery += ` AND (u.name ILIKE $${values.length + 1} OR u.email ILIKE $${
      values.length + 1
    })`;
    values.push(`%${searchQuery}%`);
  }

  try {
    const { rows } = await pool.query(getStudentsQuery, [...values]);
    res.status(200).send({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const getStudentProgress = async (req, res) => {
  const studentId = req.params.studentId;

  const getProgressQuery = `
    SELECT lesson_id, completion_date
    FROM progress
    WHERE student_id = $1
  `;

  try {
    const { rows } = await pool.query(getProgressQuery, [studentId]);
    res.status(200).send({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const getStudentEvaluations = async (req, res) => {
  const studentId = req.params.studentId;

  const getEvaluationsQuery = `
    SELECT score, is_completed, answers
    FROM evaluations
    WHERE student_id = $1
  `;

  try {
    const { rows } = await pool.query(getEvaluationsQuery, [studentId]);
    res.status(200).send({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const TeacherStudentController = {
  getStudentsByTeacherId,
  getStudentProgress,
  getStudentEvaluations,
};

module.exports = TeacherStudentController;
