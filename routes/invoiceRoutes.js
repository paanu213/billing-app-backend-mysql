const express = require('express')
const invoiceController = require('../controllers/invoice.controller')
const authenticate = require('../middleware/auth.middleware')
const router = express.Router()

router.use(authenticate)

router.post('/create-invoice', invoiceController.createInvoice)
router.get('/invoice-list', invoiceController.getInvoices)
router.post('/update-payment/:id', invoiceController.addPayments)
router.get('/invoice/:id', invoiceController.getInvoiceById )
router.delete('/delete-invoice/:id', invoiceController.deleteInvoiceById)



module.exports = router