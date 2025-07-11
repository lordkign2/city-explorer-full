// routes/auth.js
const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');

// GET /auth/login
router.get('/login', authController.showLogin);

// POST /auth/login
router.post('/login', authController.login);

// GET /auth/register
router.get('/register', authController.showRegister);

// POST /auth/register
router.post('/register', authController.register);

// GET /auth/logout
router.get('/logout', authController.logout);

module.exports = router;