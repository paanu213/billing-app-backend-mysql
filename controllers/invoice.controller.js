const invoiceService = require('../services/invoice.service')

//getting req - (data) from frontend, calling createInvoice() function from service
// and assining response to "cont response" variable. stores data in our data base this way
const createInvoice = async (req, res)=>{
    try{
        const response = await invoiceService.createInvoice(req.body)
        res.status(201).json({
            message: 'invoice created successfully',
            response
        })
    }
    catch(error){
        console.error(`server error: ${error}`)
        res.status(500).json({message: 'server error'})
    }
}


//send invoice list to client
const getInvoices = async (req, res)=>{
    
    try{
        console.log("getInvoices called");
        const invoices = await invoiceService.getAllInvoices();
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
        const response = await invoiceService.addAditionalPayments(invoiceId, req.body);

        res.status(201).json(response)

    }
    catch(error){
        console.error(`message: ${error}`)
        res.status(500).json({message: 'server error'})
    }

}

module.exports = {createInvoice, getInvoices, addPayments}