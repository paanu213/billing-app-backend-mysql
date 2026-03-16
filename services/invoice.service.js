const customerModel = require('../models/customer.model')
const invoiceModel = require('../models/invoice.model')

const createInvoice = async (data, user)=>{

    //user company id check
    if(!user.companyId){
        throw new Error ('user does not belongs to any company')
    }

    const companyId = user.companyId

    const eventAmount = Number(data.eventAmount)

    //what if advancePaid or eventDiscount values recieved as null or zero? so validating that.
    const eventDiscount = Number(data.eventDiscount ?? 0);
    const advancePaid = Number(data.advancePaid ?? 0);
    const gstPercentage = Number(data.gstPercentage ?? 0)


    if(!eventAmount || eventAmount <= 0){
        throw new Error ('Event amount should be more than 0')
    }

    if(eventDiscount < 0 || eventAmount > eventAmount){
        throw new Error ('Discount amount cant be more than bill amount')
    }


    //after discount , gst,  billingAmount calculation
    const afterDiscountAmount = eventAmount - eventDiscount
    const gstAmount = afterDiscountAmount * (gstPercentage / 100 )
    const billAmount = afterDiscountAmount + gstAmount
      

    //check if customer exists - with mobile number
    let customer = await customerModel.findCustomerByMobile(data.mobileNumber);

    let customerId;

    if(customer){
        customerId = customer.id
    } else {
        customerId = await customerModel.createCustomer(data);
    }

        const invoiceId = await invoiceModel.createInvoice({
            companyId,
            customerId,
            customerName: data.customerName,
            eventType: data.eventType,
            eventStartDate: data.eventStartDate,
            eventEndDate: data.eventEndDate,
            eventAmount: data.eventAmount,
            eventDiscount: data.eventDiscount,
            advancePaid: data.advancePaid,
            billAmount: billAmount,
            gstPercentage: data.gstPercentage,
            gstAmount
        });

        let customerName = data.customerName

        return {
            invoiceId,
            customerId,
            customerName,
            billAmount: billAmount
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
    }

    
    if(!invoiceDetails) {
        throw new Error('Invoice id not found') 

    }
    return invoiceDetails
}



module.exports = {createInvoice, getAllInvoices, addAditionalPayments, getInvoiceById}