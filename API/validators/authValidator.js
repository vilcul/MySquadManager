const { body } = require('express-validator')

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
]

const registerValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long')
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password should have a minimum of 6 chars')
        .trim()
]

module.exports = { loginValidation, registerValidation }