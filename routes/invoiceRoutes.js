const express = require('express')
const invoiceController = require('../controllers/invoice.controller')
const router = express.Router()


router.post('/create-invoice', invoiceController.createInvoice)
router.get('/invoice-list', invoiceController.getInvoices)
router.put('/update-payment/:id', invoiceController.addPayments)



module.exports = router