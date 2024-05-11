const pool = require('../../config/db');

const getUsers = async (req, res) => {
  const getUsersQuery = `
    SELECT id, name, email, role
    FROM users
    WHERE institution_id = $1`;

  try {
    const { rows } = await pool.query(getUsersQuery, [req.institutionId]);
    res.status(200).send({
      success: true,
      message: 'users retrieved successfully',
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

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const searchUserQuery = `
    SELECT id
    FROM users
    WHERE id = $1`;

  const { rows: userRows } = await pool.query(searchUserQuery, [id]);

  if (userRows.length === 0) {
    return res.status(404).send({ success: false, message: 'user not found' });
  }

  const updateUserQuery = `
    UPDATE users
    SET role = $1
    WHERE id = $2`;

  try {
    await pool.query(updateUserQuery, [role, id]);
    res.status(200).send({
      success: true,
      message: 'user role updated successfully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const searchUserQuery = `
    SELECT id
    FROM users
    WHERE id = $1`;

  const { rows: userRows } = await pool.query(searchUserQuery, [id]);

  if (userRows.length === 0) {
    return res.status(404).send({ success: false, message: 'user not found' });
  }

  const deleteUserQuery = `
    DELETE FROM users
    WHERE id = $1`;

  try {
    await pool.query(deleteUserQuery, [id]);
    res.status(200).send({
      success: true,
      message: 'user deleted successfully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
    });
  }
};

const AdminUserController = {
  getUsers,
  updateUserRole,
  deleteUser,
};

module.exports = AdminUserController;
