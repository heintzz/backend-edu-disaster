const pool = require('../config/db');

const getProfile = async (req, res) => {
  const id = req.userId;

  const searchUserQuery = `
    SELECT id, name, email
    FROM users
    WHERE id = $1`;

  const { rows } = await pool.query(searchUserQuery, [id]);

  if (rows.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'user not found',
      data: [],
    });
  }

  res.status(200).send({
    success: true,
    data: rows[0],
  });
};

const updateProfile = async (req, res) => {
  const id = req.userId;
  const { name, email } = req.body;

  const searchUserQuery = `
    SELECT id, name, email
    FROM users
    WHERE id = $1`;

  const { rows: userRows } = await pool.query(searchUserQuery, [id]);

  if (userRows.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'user not found',
      data: [],
    });
  }

  const user = userRows[0];

  const updateProfileQuery = `
    UPDATE users
    SET name = $2, email = $3
    WHERE id = $1`;

  try {
    const { rows } = await pool.query(updateProfileQuery, [
      id,
      name || user.name,
      email || user.email,
    ]);
    res.status(200).send({
      success: true,
      message: 'user updated successfully',
      data: rows[0],
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

const ProfileController = {
  getProfile,
  updateProfile,
};

module.exports = ProfileController;
