const express = require('express')
const router = express.Router();
const companyController = require('../controllers/company.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware')

router.get('/companiesList', companyController.companiesList)
router.delete('/deleteCompany/:id', companyController.deleteCompanyById)

module.exports = router