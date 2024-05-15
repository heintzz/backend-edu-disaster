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

const UserClassController = {
  joinClass,
};

module.exports = UserClassController;
