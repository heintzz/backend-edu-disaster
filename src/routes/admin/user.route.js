const express = require('express');
const AdminUserController = require('../../controllers/admin/user.controller');
const VerifyMiddleware = require('../../middleware/verify');

const router = express.Router();

router.use(VerifyMiddleware.verifyToken, VerifyMiddleware.verifyAdmin);

router.get('/', AdminUserController.getUsers);
router.post('/', AdminUserController.createTeacherAccount);
router.delete('/:id', AdminUserController.deleteUser);
router.get('/:id', AdminUserController.getUserData);
router.put('/:id/verify', AdminUserController.verifyTeacherAccount);
router.put('/:id/role', AdminUserController.updateUserRole);
router.delete('/:id', AdminUserController.deleteUser);

module.exports = router;
