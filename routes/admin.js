// routes/admin.js
const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes here require login and admin access
router.use(isLoggedIn, isAdmin);

// Admin Dashboard
router.get('/', adminController.getAdminDashboard);

// Manage Cities
router.get('/cities', adminController.getAllCities);
router.get('/cities/new', adminController.showNewCityForm);
router.post('/cities', adminController.createCity);
router.get('/cities/:id/edit', adminController.showEditCityForm);
router.put('/cities/:id', adminController.updateCity);
router.delete('/cities/:id', adminController.deleteCity);

// Manage Countries
router.get('/countries', adminController.getAllCountries);
router.get('/countries/new', adminController.showNewCountryForm);
router.post('/countries', adminController.createCountry);
router.get('/countries/:id/edit', adminController.showEditCountryForm);
router.put('/countries/:id', adminController.updateCountry);
router.delete('/countries/:id', adminController.deleteCountry);

module.exports = router;