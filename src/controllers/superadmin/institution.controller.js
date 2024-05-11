const pool = require('../../config/db');

const getInstitutions = async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT name, address, code FROM institutions');
    res.status(200).send({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal Server Error',
    });
  }
};

const createInstitution = async (req, res) => {
  const { name, address } = req.body;

  while (true) {
    var code = Math.random().toString(36).substring(2, 8);
    var { rows } = await pool.query(
      `
      SELECT id FROM institutions 
      WHERE code = $1`,
      [code]
    );

    if (rows.length === 0) {
      break;
    }
  }

  if (!name || !address) {
    return res.status(400).send({
      success: false,
      message: 'All fields are required',
    });
  }

  const insertInstitutionQuery = `
      INSERT INTO institutions (name, address, code)
      VALUES ($1, $2, $3) 
      RETURNING id, name, address, code`;

  try {
    const { rows } = await pool.query(insertInstitutionQuery, [name, address, code]);

    res.status(201).send({
      success: true,
      message: 'institution created successfully',
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'internal Server Error',
    });
  }
};

const InstitutionController = { getInstitutions, createInstitution };

module.exports = InstitutionController;
