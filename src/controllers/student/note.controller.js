const pool = require('../../config/db');

const getNotes = async (req, res) => {
  const getNotesQuery = `
    SELECT id, content, created_at
    FROM notes
    WHERE student_id = $1`;

  try {
    const { rows } = await pool.query(getNotesQuery, [req.userId]);

    res.status(200).send({
      success: true,
      message: 'notes fetched successfully',
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

const UserNotesController = {
  getNotes,
};

module.exports = UserNotesController;
