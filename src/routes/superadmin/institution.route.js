const { Router } = require('express');
const InstitutionController = require('../../controllers/superadmin/institution.controller');
const VerifyMiddleware = require('../../middleware/verify');

const router = Router();

router.use(VerifyMiddleware.verifyToken, VerifyMiddleware.verifySuperAdmin);

router.get('/', InstitutionController.getInstitutions);
router.post('/', InstitutionController.createInstitution);

module.exports = router;
