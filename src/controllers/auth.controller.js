const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const enums = require('../utils/enums');

dotenv.config();

const Signup = async (req, res) => {
  const { name, email, password, role, institutionCode } = req.body;

  const searchInstitutionQuery = `
    SELECT id 
    FROM institutions 
    WHERE code = $1`;

  const { rows: institutionRows } = await pool.query(searchInstitutionQuery, [institutionCode]);

  if (institutionRows.length === 0) {
    return res.status(404).send({ success: false, message: 'institution not found' });
  }

  const searchUserQuery = `
    SELECT id
    FROM users
    WHERE email = $1`;

  const { rows } = await pool.query(searchUserQuery, [email]);

  if (rows.length > 0) {
    return res.status(400).send({
      success: false,
      message: 'email already exists',
      data: rows,
    });
  }

  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).send({
      success: false,
      message: 'invalid email',
      data: rows,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const insertUserQuery = `
      INSERT INTO users (name, email, password, role, institution_id)
      VALUES ($1, $2, $3, $4, $5)`;

    await pool.query(insertUserQuery, [
      name,
      email,
      hashedPassword,
      role || enums.ROLE.STUDENT,
      institutionRows[0].id,
    ]);

    res.status(201).send({ success: true, message: 'user created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'internal Server Error' });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  const searchUserQuery = `
    SELECT id, name, email, role, password, institution_id, is_verified
    FROM users
    WHERE email = $1
  `;

  const { rows } = await pool.query(searchUserQuery, [email]);

  const user = rows[0];
  if (!user) {
    return res.status(404).send({
      success: false,
      message: 'user not found, please sign up',
      data: rows,
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const dataToSign = {
      user_id: user.id,
      email: user.email,
      role: user.role,
      institution_id: user.institution_id,
      is_verified: user.is_verified,
    };

    const token = jwt.sign(dataToSign, process.env.SECRET_ACCESS_TOKEN);

    res.cookie('access_token', token, {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 3600 * 1000,
    });

    res.status(200).send({
      success: true,
      message: 'user logged in successfully',
      accessToken: token,
    });
  } else {
    res.status(401).send({
      success: false,
      message: 'invalid credentials',
    });
  }
};

const Logout = async (req, res) => {
  res.clearCookie('access_token', { httpOnly: true });
  res.status(200).send({ success: true, message: 'user logged out successfully' });
};

const AuthController = {
  Signup,
  Login,
  Logout,
};

module.exports = AuthController;
