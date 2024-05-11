const pool = require('../../config/db');

const joinClass = async (req, res) => {
  const { classId } = req.params;

  const searchClassQuery = `
    SELECT id, name
    FROM classes
    WHERE id = $1`;

  const { rows: classRows } = await pool.query(searchClassQuery, [classId]);

  if (classRows.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'class not found',
      data: [],
    });
  }

  const classData = classRows[0];

  const joinClassQuery = `
    INSERT INTO students_classes (student_id, class_id)
    VALUES ($1, $2)`;

  try {
    await pool.query(joinClassQuery, [req.userId, classData.id]);
    res.status(200).send({
      success: true,
      message: 'joined class successfully',
      data: classData,
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
  joinClass,
};

module.exports = UserClassController;
