const pool = require('../config/db');

const getInstitutionsList = async (req, res) => {
  const getInstitutionsQuery = `
    SELECT name, code
    FROM institutions
  `;

  try {
    const { rows } = await pool.query(getInstitutionsQuery);
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

const InstitutionController = {
  getInstitutionsList,
};

module.exports = InstitutionController;
