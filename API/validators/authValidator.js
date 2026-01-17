const { body } = require('express-validator')

const authValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password should have a minimum of 6 chars')
        .trim()
]

module.exports = { authValidation }