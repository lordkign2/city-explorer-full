// routes/admin.js
const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes here require login and admin access
router.use(isLoggedIn, isAdmin);

// Admin Dashboard
router.get('/', isAdmin, adminController.getAdminDashboard);

// Manage Cities
router.get('/cities', isAdmin, adminController.getAllCities);
router.get('/cities/new', isAdmin, adminController.showNewCityForm);
router.post('/cities', isAdmin, adminController.createCity);
router.get('/cities/:id/edit', isAdmin, adminController.showEditCityForm);
router.put('/cities/:id', isAdmin, adminController.updateCity);
router.delete('/cities/:id', isAdmin, adminController.deleteCity);

// Manage Countries
router.get('/countries', isAdmin, adminController.getAllCountries);
router.get('/countries/new', isAdmin, adminController.showNewCountryForm);
router.post('/countries', isAdmin, adminController.createCountry);
router.get('/countries/:id/edit', isAdmin, adminController.showEditCountryForm);
router.put('/countries/:id', isAdmin, adminController.updateCountry);
router.delete('/countries/:id', isAdmin, adminController.deleteCountry);

module.exports = router;