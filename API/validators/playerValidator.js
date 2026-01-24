const { body } = require('express-validator');

const VALID_POSITIONS = ['Goalkeeper', 'Center Back', 'Full Back', 'Defensive Midfielder', 'Central Midfielder', 'Winger', 'Striker'];
const VALID_FEET = ['Right', 'Left', 'Both'];

const playerValidation = [
    // Basic info
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1 and 100 characters'),
    body('age')
        .notEmpty()
        .withMessage('Age is required')
        .isInt({ min: 8, max: 20 })
        .withMessage('Age must be a valid number (8-20 years)'),
    body('position')
        .notEmpty()
        .withMessage('Position is required')
        .isIn(VALID_POSITIONS)
        .withMessage(`Position must be one of: ${VALID_POSITIONS.join(', ')}`),
    body('team')
        .notEmpty()
        .withMessage('Team is required (use "No team" if player has no team)')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Team name must be at least 2 characters'),

    // Physical Data
    body('physical.height')
        .notEmpty()
        .isInt({ min: 100, max: 220 })
        .withMessage('Height must be between 100 and 220 cm'),
    body('physical.weight')
        .notEmpty()
        .isInt({ min: 30, max: 150 })
        .withMessage('Weight must be between 30 and 150 kg'),
    body('physical.preferredFoot')
        .notEmpty()
        .isIn(VALID_FEET)
        .withMessage(`Preferred foot must be one of: ${VALID_FEET.join(', ')}`),

    // Stats
    body('stats.matchesPlayed')
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage('Matches played must be a positive number'),
    body('stats.goalsScored')
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage('Goals scored must be a positive number'),
    body('stats.assists')
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage('Assists must be a positive number'),

    // Skill Ratings (optional)
    body('stats.skillRatings.technical')
        .optional()
        .isFloat({ min: 1, max: 10 })
        .withMessage('Technical rating must be between 1 and 10'),
    body('stats.skillRatings.physical')
        .optional()
        .isFloat({ min: 1, max: 10 })
        .withMessage('Physical rating must be between 1 and 10'),
    body('stats.skillRatings.tactical')
        .optional()
        .isFloat({ min: 1, max: 10 })
        .withMessage('Tactical rating must be between 1 and 10'),
    body('stats.skillRatings.mental')
        .optional()
        .isFloat({ min: 1, max: 10 })
        .withMessage('Mental rating must be between 1 and 10')
];

module.exports = { playerValidation };
