// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /auth/login
router.get('/login', authController.getLogin);

// POST /auth/login
router.post('/login', authController.postLogin);

// GET /auth/register
router.get('/register', authController.getRegister);

// POST /auth/register
router.post('/register', authController.postRegister);

// GET /auth/logout
router.get('/logout', authController.logout);

module.exports = router;