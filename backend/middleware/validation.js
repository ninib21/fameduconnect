const { body, validationResult } = require('express-validator');

// Validation rules
const validationRules = {
  register: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/),
    body('name').isLength({ min: 2, max: 50 }).matches(/^[a-zA-Z\s]+$/),
    body('role').isIn(['parent', 'teacher', 'admin']),
    body('phone').optional().isMobilePhone()
  ],

  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],

  message: [
    body('content').isLength({ min: 1, max: 1000 }).trim().escape(),
    body('receiverId').isAlphanumeric()
  ],

  grade: [
    body('score').isFloat({ min: 0, max: 100 }),
    body('assignmentName').isLength({ min: 1, max: 100 }).trim().escape(),
    body('comments').optional().isLength({ max: 500 }).trim().escape()
  ]
};

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

module.exports = { validationRules, validate };