const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/register', authenticate, authController.register)
router.post('/login', authController.login)

module.exports = router