const customerModel = require('../models/customer.model')
const Invoice = require('../models/invoice.model')
const User = require('../models/user.model')
const Customer = require('../models/customer.model')

const createInvoice = async (data, user)=>{

    const id=  user.userId

    const foundUser = await User.findOne({where:{id}})


    if(!foundUser){
        throw new Error ('user not found')
    }

    const companyId = foundUser.companyId;

    const {eventAmount, eventDiscount, gstPercentage, advancePaid, mobileNumber} = data


    if(!eventAmount || eventAmount <= 0){
        throw new Error ('Event amount should be more than 0')
    }

    if(eventDiscount < 0 || eventDiscount > eventAmount){
        throw new Error ('Discount amount cant be more than bill amount')
    }


    //after discount , gst,  billingAmount calculation
    const billAmount = eventAmount - eventDiscount
    const gstAmount = billAmount * (gstPercentage / 100 )
    const finalAmount = billAmount + gstAmount
    const pendingAmount = finalAmount - advancePaid
      

    //check if customer exists - with mobile number
    let customer = await Customer.findOne({where:{mobileNumber}});

    let customerId;

    if(customer){
        customerId = customer.id
    } else {
        customerId = await customerModel.createCustomer(data);
    }
        const invoice = await Invoice.create({
            companyId,
            customerId,
            eventType: data.eventType,
            eventStartDate: data.eventStartDate,
            eventEndDate: data.eventEndDate,
            eventAmount: data.eventAmount,
            eventDiscount: data.eventDiscount,
            advancePaid: data.advancePaid,
            billAmount: billAmount,
            gstPercentage: data.gstPercentage,
            gstAmount,
            finalAmount,
            pendingAmount
        });

        const invoiceId = invoice.id

        let customerName = data.customerName

        return {
            invoiceId,
            customerId,
            customerName,
            finalAmount,
            pendingAmount
        }
}

const getAllInvoices = async (user)=>{
    if (user.role === 'super_admin') {
    return await invoiceModel.getAllInvoices();
} else {
    return await invoiceModel.getAllInvoices(user.companyId);
}
}


const addAditionalPayments = async (invoiceId, data, user)=>{

    if(!invoiceId) return res.status(404).send('invoice not fount')

    const {amount, date} = data;

    if(!amount || amount <=0){
        throw new Error ('invalid Paymnet amount')
    } 

    let invoice;

    if (user.role === 'super_Admin'){
        invoice = invoiceModel.getInvoiceById(invoiceId)
    } else {
        invoice = await invoiceModel.getInvoiceByIdAndCompany(
            invoiceId, user.companyId
        )
    }

    if (!invoice) {
        throw new Error('Invoice not found');
    }

    await invoiceModel.additionalPayments(invoiceId, amount, date);
    return  {message: 'Payment Added Successfully'}
}

const getInvoiceById = async (id, user)=>{

    let invoiceDetails;

    if(user.role === 'super_admin'){
        invoiceDetails = await invoiceModel.getInvoiceByIdAndCompany(id)
    }
    else {
        invoiceDetails = await invoiceModel.getInvoiceByIdAndCompany(id, user.companyId)
        console.log("invoice details in service:", invoiceDetails)
    }

    
    if(!invoiceDetails) {
        throw new Error('Invoice id not found') 
    }
    return invoiceDetails
    console.log("this is invoice details", invoiceDetails)
}



module.exports = {createInvoice, getAllInvoices, addAditionalPayments, getInvoiceById}