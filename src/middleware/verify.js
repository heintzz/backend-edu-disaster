const enums = require('../utils/enums');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.role = decoded.role;
    req.userId = decoded.user_id;
    req.institutionId = decoded.institution_id;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.role !== enums.ROLE.ADMIN) return res.status(403).send({ message: 'forbidden' });
  next();
};

const verifyTeacher = (req, res, next) => {
  if (req.role !== enums.ROLE.TEACHER) return res.status(403).send({ message: 'forbidden' });

  if (!req.is_verified) {
    return res.status(401).send({ message: 'teacher not verified yet' });
  }

  next();
};

const verifySuperAdmin = (req, res, next) => {
  if (req.role !== enums.ROLE.SUPER_ADMIN) return res.status(403).send({ message: 'forbidden' });
  next();
};

const VerifyMiddleware = {
  verifyToken,
  verifyAdmin,
  verifyTeacher,
  verifySuperAdmin,
};

module.exports = VerifyMiddleware;
