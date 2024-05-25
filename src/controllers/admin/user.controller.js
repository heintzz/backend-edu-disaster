const pool = require('../../config/db');
const { ROLE } = require('../../utils/enums');

const getUsers = async (req, res) => {
  const { role } = req.query;

  const values = [req.institutionId];

  let getUsersQuery = `
    SELECT id, name, email, role
    FROM users
    WHERE institution_id = $1`;

  if (role) {
    if (role === ROLE.TEACHER) {
      getUsersQuery = `
        SELECT 
          u.id, u.name, u.email, u.role, 
          u.is_verified, COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS classes
        FROM users u
        LEFT JOIN classes c ON u.id = c.teacher_id
        WHERE u.institution_id = $1 AND u.role = $2
        GROUP BY u.id, u.name, u.email, u.role, u.is_verified
        `;
    } else if (role === ROLE.STUDENT) {
      getUsersQuery = `
        SELECT
          u.id, u.name, u.email, u.role, c.name AS class
        FROM users u
        JOIN students_classes sc ON u.id = sc.student_id        
        JOIN classes c ON sc.class_id = c.id        
        WHERE u.institution_id = $1 AND u.role = $2
      `;
    } else {
      getUsersQuery += ` AND role = $2`;
    }
    values.push(role);
  }

  try {
    const { rows } = await pool.query(getUsersQuery, [...values]);
    res.status(200).send({
      success: true,
      message: 'users retrieved successfully',
      data: rows,
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

const getUserData = async (req, res) => {
  const { id } = req.params;

  const getUserQuery = `
    SELECT id, name, email, role, is_verified
    FROM users
    WHERE id = $1`;

  try {
    const { rows } = await pool.query(getUserQuery, [id]);

    if (rows[0].role === ROLE.TEACHER) {
      const getClassesQuery = `
        SELECT name
        FROM classes
        WHERE teacher_id = $1`;

      const { rows: classRows } = await pool.query(getClassesQuery, [id]);
      rows[0].classes = classRows.map((row) => row.name);
    }

    res.status(200).send({
      success: true,
      message: 'user retrieved successfully',
      data: rows[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
      data: {},
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
    SET role = $1, is_verified = true
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

const verifyTeacherAccount = async (req, res) => {
  const { id } = req.params;

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
    SET is_verified = true
    WHERE id = $1`;

  try {
    await pool.query(updateUserQuery, [id]);
    res.status(200).send({
      success: true,
      message: 'teacher account verified successfully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal server error',
    });
  }
};

const createTeacherAccount = async (req, res) => {
  const { name, email, password } = req.body;

  const searchUserQuery = `
    SELECT id
    FROM users
    WHERE email = $1`;

  const { rows: userRows } = await pool.query(searchUserQuery, [email]);

  if (userRows.length > 0) {
    return res.status(400).send({ success: false, message: 'email already in use' });
  }

  const createUserQuery = `
    INSERT INTO users (name, email, password, role, institution_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`;

  try {
    const { rows } = await pool.query(createUserQuery, [
      name,
      email,
      password,
      ROLE.TEACHER,
      req.institutionId,
    ]);
    res.status(201).send({
      success: true,
      message: 'teacher account created successfully',
      data: { id: rows[0].id },
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
    SELECT id, role
    FROM users
    WHERE id = $1`;

  const { rows: userRows } = await pool.query(searchUserQuery, [id]);

  if (userRows.length === 0) {
    return res.status(404).send({ success: false, message: 'user not found' });
  }

  const client = await pool.connect();

  if (userRows[0].role === ROLE.STUDENT) {
    try {
      await client.query('BEGIN');

      const deleteStudentsClasses = `
        DELETE FROM students_classes
        WHERE student_id = $1;
      `;
      await client.query(deleteStudentsClasses, [id]);

      const deleteEvaluations = `
        DELETE FROM evaluations
        WHERE student_id = $1;
      `;
      await client.query(deleteEvaluations, [id]);

      const deleteProgress = `
        DELETE FROM progress
        WHERE student_id = $1;
      `;
      await client.query(deleteProgress, [id]);

      const deleteUsers = `
        DELETE FROM users
        WHERE id = $1;
      `;
      await client.query(deleteUsers, [id]);

      await client.query('COMMIT');
      res.status(200).send({
        success: true,
        message: 'user deleted successfully',
      });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } else if (userRows[0].role === ROLE.TEACHER) {
    try {
      await client.query('BEGIN');

      const deleteClasses = `
        DELETE FROM classes
        WHERE teacher_id = $1;
      `;
      await client.query(deleteClasses, [id]);

      const deleteUsers = `
        DELETE FROM users
        WHERE id = $1;
      `;

      await client.query(deleteUsers, [id]);

      await client.query('COMMIT');
      res.status(200).send({
        success: true,
        message: 'user deleted successfully',
      });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};

const AdminUserController = {
  getUsers,
  getUserData,
  updateUserRole,
  deleteUser,
  createTeacherAccount,
  verifyTeacherAccount,
};

module.exports = AdminUserController;
