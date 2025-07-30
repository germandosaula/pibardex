const express = require('express');
const router = express.Router();

// Import controllers
const adminAuthController = require('../controllers/adminAuthController');
const adminUserController = require('../controllers/adminUserController');
const adminCardController = require('../controllers/adminCardController');

// Import middleware
const { isAdmin, hasPermission } = require('../middleware/adminAuth');

// Admin auth routes
router.post('/login', adminAuthController.adminLogin);
router.get('/profile', isAdmin, adminAuthController.getAdminProfile);
router.post('/create', isAdmin, adminAuthController.createAdmin);
router.put('/update/:id', isAdmin, adminAuthController.updateAdmin);
router.put('/change-password', isAdmin, adminAuthController.changePassword);
router.get('/list', isAdmin, adminAuthController.listAdmins);

// Admin user management routes
router.get('/users', isAdmin, hasPermission('manageUsers'), adminUserController.getAllUsers);
router.get('/users/stats', isAdmin, hasPermission('viewStats'), adminUserController.getUserStats);
router.get('/users/:id', isAdmin, hasPermission('manageUsers'), adminUserController.getUserById);
router.put('/users/:id', isAdmin, hasPermission('manageUsers'), adminUserController.updateUser);
router.delete('/users/:id', isAdmin, hasPermission('manageUsers'), adminUserController.deleteUser);

// Admin card management routes
router.get('/cards', isAdmin, hasPermission('manageCards'), adminCardController.getAllCards);
router.get('/cards/stats', isAdmin, hasPermission('viewStats'), adminCardController.getCardStats);
router.delete('/cards/clear-all', isAdmin, hasPermission('manageCards'), adminCardController.clearAllCards);
router.get('/cards/:id', isAdmin, hasPermission('manageCards'), adminCardController.getCardById);
router.post('/cards', isAdmin, hasPermission('manageCards'), adminCardController.createCard);
router.put('/cards/:id', isAdmin, hasPermission('manageCards'), adminCardController.updateCard);
router.delete('/cards/:id', isAdmin, hasPermission('manageCards'), adminCardController.deleteCard);
router.delete('/cards/:id/force', isAdmin, hasPermission('manageCards'), adminCardController.forceDeleteCard);

module.exports = router;