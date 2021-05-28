const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')

// Register
router.post('/register', authController.registerUser)
// login
router.post('/login', authController.loginUser)

module.exports = router;