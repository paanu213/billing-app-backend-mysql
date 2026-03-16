const invoiceService = require('../services/invoice.service')

//getting req - (data) from frontend, calling createInvoice() function from service
const createInvoice = async (req, res)=>{
    try{

        const response = await invoiceService.createInvoice(req.body, req.user)
        res.status(201).json({
            message: 'invoice created successfully',
            response
        })
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}


//send invoice list to client
const getInvoices = async (req, res)=>{
    
    try{
        const invoices = await invoiceService.getAllInvoices(req.user);
        res.status(200).json(invoices)
    }
    catch (error){
        console.log(error);
        res.status(500).json({message: error.message})
    }
};


const addPayments = async (req, res)=>{
    try{
        const invoiceId = req.params.id;

        if(!invoiceId) return res.status(404).send('invoice not fount')
        const response = await invoiceService.addAditionalPayments(invoiceId, req.body, req.user);

        res.status(201).json(response)

    }
    catch(error){
        console.error(`message: ${error}`)
        res.status(500).json({message: 'server error'})
    }

}

const getInvoiceById = async(req, res)=>{
    try{
        const id = req.params.id
        const invoiceDetails = await invoiceService.getInvoiceById(id, req.user)
        res.status(200).json(invoiceDetails)
        console.log("invoice Details:", invoiceDetails)
    }
    catch (error){
        console.log(`error: ${error}`)
        res.status(500).json({message: 'server error'})
    }
}

module.exports = {createInvoice, getInvoices, addPayments, getInvoiceById}