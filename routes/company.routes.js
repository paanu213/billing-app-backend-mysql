const express = require('express')
const router = express.Router();
const companyController = require('../controllers/company.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware')

router.post('/', authenticate, authorize(['super_admin']), companyController.createCompanyWithAdmin)

module.exports = router