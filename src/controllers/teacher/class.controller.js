const pool = require('../../config/db');

const generateRandomCode = async (req, res) => {
  const searchClassQuery = `
      SELECT id, name
      FROM classes
      WHERE class_code = $1`;

  while (true) {
    var classCode = Math.random().toString(36).substring(2, 8);

    try {
      const { rows: classRows } = await pool.query(searchClassQuery, [classCode]);
      if (classRows.length === 0) {
        res.status(200).send({
          success: true,
          message: 'random code generated',
          data: { classCode },
        });
        break;
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: 'internal server error',
        data: [],
      });
    }
  }
};

const createClass = async (req, res) => {
  const { name, classCode, academicYear } = req.body;

  const createClassQuery = `
    INSERT INTO classes (name, class_code, academic_year, teacher_id, institution_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, class_code`;

  try {
    const { rows } = await pool.query(createClassQuery, [
      name,
      classCode,
      academicYear,
      req.userId,
      req.institutionId,
    ]);
    res.status(201).send({
      success: true,
      message: 'class created successfully',
      data: rows[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const getClasses = async (req, res) => {
  const getClassesQuery = `
      SELECT id, name, class_code
      FROM classes
      WHERE teacher_id = $1`;

  try {
    const { rows } = await pool.query(getClassesQuery, [req.userId]);
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

const getEvaluationsByClassId = async (req, res) => {
  const classId = req.params.classId;

  const searchEvaluationQuery = `
    SELECT u.id as student_id, u.name as student_name, 
      e.id as evaluation_id, e.answers, e.is_completed, e.score
    FROM evaluations e
    JOIN users u
    ON e.student_id = u.id
    WHERE class_id = $1`;

  try {
    const { rows: evaluationRows } = await pool.query(searchEvaluationQuery, [classId]);

    if (evaluationRows.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'evaluation not found',
        data: [],
      });
    }

    res.status(200).send({
      success: true,
      message: 'evaluation list successfully retrieved',
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

const TeacherClassController = {
  getClasses,
  createClass,
  generateRandomCode,
  getEvaluationsByClassId,
};

module.exports = TeacherClassController;
