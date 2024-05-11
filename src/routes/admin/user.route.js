const express = require('express');
const AdminUserController = require('../../controllers/admin/user.controller');
const VerifyMiddleware = require('../../middleware/verify');

const router = express.Router();
router.get(
  '/',
  VerifyMiddleware.verifyToken,
  VerifyMiddleware.verifyAdmin,
  AdminUserController.getUsers
);
router.put(
  '/:id/role',
  VerifyMiddleware.verifyToken,
  VerifyMiddleware.verifyAdmin,
  AdminUserController.updateUserRole
);
router.delete(
  '/:id',
  VerifyMiddleware.verifyToken,
  VerifyMiddleware.verifyAdmin,
  AdminUserController.deleteUser
);

module.exports = router;
