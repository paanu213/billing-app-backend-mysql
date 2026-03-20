const customerModel = require('../models/customer.model')
const Invoice = require('../models/invoice.model')
const User = require('../models/user.model')
const Customer = require('../models/customer.model')
const Payments = require('../models/payments.model')

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


//get all invoice list
const getAllInvoices = async (user)=>{

    const {companyId, role} = user

    if (role === 'super_admin') {
        return await Invoice.findAll();
    } else {
        return await Invoice.findAll({where:{companyId}});
    }
}


const addAditionalPayments = async (invoiceId, data, user)=>{
    
    if(!invoiceId) {
        throw new Error ('invoice not fount')
    }

    const {amount, date} = data;
    const {userId, role, companyId} = user
    const paymentDate = date
    const id = invoiceId

    if(!amount || amount <=0){
        throw new Error ('invalid Paymnet amount')
    } 

    let invoice;

    if (role === 'super_Admin'){
        invoice = await Invoice.findOne({where:{id}})
    } else {
        invoice = await Invoice.findOne({where:{id, companyId}})
    }

    if (!invoice) {
        throw new Error('Invoice not found');
    }

    const response = await Payments.create( {
        invoiceId: id,
        amount: amount,
        paymentDate: date || new Date()
    });

    invoice.pendingAmount -= amount
    await invoice.save();

    return  response

}


//get invoice details by id
const getInvoiceById = async (id, user)=>{

    const {role, companyId} = user
    let invoiceDetails;

    if(role === 'super_admin'){
        invoiceDetails = await Invoice.findOne({where: {id}})
    }
    else {
        invoiceDetails = await Invoice.findOne( {where:{id, companyId}})
    }
    
    if(!invoiceDetails) {
        throw new Error('Invoice id not found') 
    }
    return invoiceDetails
}


const deleteInvoiceById = async (id, user)=>{

    const {companyId, role, userId} = user

    if(!id) {
        throw new Error ('invoice id required to delete')
    }

    const invoice = await Invoice.findOne({where:{id, companyId}})

    if(!invoice){
        throw new Error ('Invoice not found')
    }

    const response = await Invoice.destroy({where:{id, companyId}})

    return response
}



module.exports = {createInvoice, getAllInvoices, addAditionalPayments, getInvoiceById, deleteInvoiceById}