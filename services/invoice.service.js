const invoiceModel = require('../models/invoice.model')
const customerModel = require('../models/customer.model')

const createInvoice = async (data)=>{
        //what if advancePaid or eventDiscount values recieved as null or zero? so validating that.
        data.eventDiscount = data.eventDiscount ?? 0;
        data.advancePaid = data.advancePaid ?? 0;

        //after discount amount
        const afterDiscountAmount = data.eventAmount - data.eventDiscount

        //gst calculation
        const gstAmount = afterDiscountAmount * (data.gstPercentage / 100 )

        //calculating billingAmount
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

const getAllInvoices = async ()=>{
    return await invoiceModel.getAllInvoices();
}


const addAditionalPayments = async (invoiceId, data)=>{
    const {amount, date} = data;

    if(!amount || amount <=0){
        throw new error ('invalid Paymnet amount')
    } 

    await invoiceModel.additionalPayments(invoiceId, amount, date);
    return  {message: 'Payment Added Successfully'}
}



module.exports = {createInvoice, getAllInvoices, addAditionalPayments}