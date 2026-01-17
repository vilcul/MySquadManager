const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const playersRouter = require('./players'); 

router.use('/users', usersRouter);
router.use('/players', playersRouter); 

module.exports = router;