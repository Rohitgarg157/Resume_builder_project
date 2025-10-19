const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Resume validation
const validateResume = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Resume title is required'),
  body('template')
    .optional()
    .isIn(['modern', 'classic', 'creative', 'minimal'])
    .withMessage('Invalid template type'),
  handleValidationErrors
];

// Personal info validation
const validatePersonalInfo = [
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

// Work experience validation
const validateWorkExperience = [
  body('companyName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Company name is required'),
  body('position')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Position is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  handleValidationErrors
];

// Education validation
const validateEducation = [
  body('institution')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Institution name is required'),
  body('degree')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Degree is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateResume,
  validatePersonalInfo,
  validateWorkExperience,
  validateEducation
};
