const express = require('express');
const InstitutionController = require('../../controllers/institution.controller');

const router = express.Router();

router.get('/', InstitutionController.getInstitutionsList);

module.exports = router;
