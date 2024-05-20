const pool = require('../../config/db');

const joinClass = async (req, res) => {
  const { classCode } = req.params;

  const searchClassQuery = `
    SELECT id, name, institution_id
    FROM classes
    WHERE class_code = $1`;

  const { rows: classRows } = await pool.query(searchClassQuery, [classCode]);

  if (classRows.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'class not found',
      data: [],
    });
  }

  const searchStudentClassQuery = `
    SELECT student_id, class_id
    FROM students_classes
    WHERE student_id = $1 AND class_id = $2`;

  const { rows: studentClassRows } = await pool.query(searchStudentClassQuery, [
    req.userId,
    classRows[0].id,
  ]);

  if (studentClassRows.length > 0) {
    return res.status(400).send({
      success: false,
      message: 'already joined class',
      data: [],
    });
  }

  const classData = classRows[0];

  const joinClassQuery = `
    INSERT INTO students_classes (student_id, class_id, institution_id)
    VALUES ($1, $2, $3)`;

  try {
    await pool.query(joinClassQuery, [req.userId, classData.id, classData.institution_id]);
    res.status(200).send({
      success: true,
      message: 'joined class successfully',
      data: classData,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

const getClasses = async (req, res) => {
  const searchClassesQuery = `
    SELECT classes.id, classes.name, classes.class_code, institutions.name as institution
    FROM classes
    JOIN institutions ON classes.institution_id = institutions.id
    JOIN students_classes ON classes.id = students_classes.class_id
    WHERE students_classes.student_id = $1`;

  try {
    const { rows: classesRows } = await pool.query(searchClassesQuery, [req.userId]);

    res.status(200).send({
      success: true,
      message: 'student classes retrieved',
      data: classesRows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: [],
    });
  }
};

const UserClassController = {
  getClasses,
  joinClass,
};

module.exports = UserClassController;
