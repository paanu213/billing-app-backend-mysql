const pool = require('../config/db')

const createInvoice =  async (data) => {
    const {customerId,
           eventType,
           eventStartDate,
           eventEndDate,
           eventAmount,
           eventDiscount=0,
           advancePaid=0,
           billAmount,
           gstPercentage,
           gstAmount
        } = data;


        const [result] = await pool.execute(
            `INSERT INTO invoices
            (customer_id, event_type, event_start_date, event_end_date, event_amount,
            event_discount, advance_paid, bill_amount, gst_percentage, gst_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customerId,
                eventType,
                eventStartDate,
                eventEndDate,
                eventAmount,
                eventDiscount,
                advancePaid,
                billAmount,
                gstPercentage,
                gstAmount
            ]
        );

        return result.insertId;
}


//Get invoice list
const getAllInvoices = async ()=>{
    const [rows] = await pool.execute(
        ` SELECT 
        i.id,
        i.event_type,
        i.event_start_date,
        i.event_end_date,
        i.event_amount,
        i.event_discount,
        i.advance_paid,
        i.bill_amount,
        i.created_at,
        
        c.customer_name,
        c.mobile_number,

        COALESCE(SUM(ap.amount),0) AS total_additional

        FROM invoices i
        INNER JOIN customers c
        ON i.customer_id = c.id

        LEFT JOIN additional_payments ap
        ON i.id = ap.invoice_id

        GROUP BY i.id
        
        ORDER BY i.created_at DESC`
    )
    //converting snake_case to camcleCase to send frontend - easy communication and secure.
    return rows.map(row =>{
        const pending = row.bill_amount - row.advance_paid - row.total_additional;

        return {
            id: row.id,
            eventType: row.event_type,
            eventStartDate: row.event_start_date,
            eventEndDate: row.event_end_date,
            eventAmount: row.event_amount,
            eventDiscount: row.event_discount,
            advancePaid: row.advance_paid,
            billAmount: row.bill_amount,
            createdAt: row.created_at,

            customerName: row.customer_name,
            mobileNumber: row.mobile_number,

            totalAdditional: row.total_additional,
            pendingAmount: pending <= 0 ? 0 : pending,
            finalAmountCleared: pending <= 0 ? "Completed" : "Pending"

        }
        
    });
};


//recieving additional payment data from frontend and storing in db 
const additionalPayments = async (invoiceId, amount, date)=>{

    await pool.execute(
        `INSERT INTO additional_payments 
        (invoice_id, amount, payment_date)
        values(?, ?, ?)`,
        [
        invoiceId,
        amount,
        date || new Date()
        ]
    )
};

const getInvoiceById = async (id)=>{

    const [invoiceRows] = await pool.execute(
        `
        SELECT
        i.id,
        i.event_type,
        i.event_start_date,
        i.event_end_date,
        i.event_amount,
        i.event_discount,
        i.advance_paid,
        i.bill_amount,
        i.created_at,
        i.gst_percentage,
        i.gst_amount,

        c.customer_name,
        c.mobile_number

        FROM invoices i
        INNER JOIN customers c
        ON i.customer_id = c.id
        WHERE i.id = ?
        `,
        [id]
    )
    
    if (invoiceRows.length === 0) {
    return null;
    }

    const invoice = invoiceRows[0]




    //get additional paymnets
    const [paymentRows] = await pool.execute(
        `
        SELECT id, amount, payment_date
        FROM additional_payments
        WHERE invoice_id = ?
        ORDER BY payment_date ASC
        `,
        [id]
    );

    //Calculate additional payment total
    const totalAdditionalPayment = paymentRows.reduce(
        (sum, p) => sum + Number(p.amount), 0
    )

    //pending amount calculation
    const pendingAmount = invoice.bill_amount - ( invoice.advance_paid || 0 ) - totalAdditionalPayment


    return {
        id: invoice.id,
        eventType: invoice.event_type,
        eventStartDate: invoice.event_start_date,
        eventEndDate: invoice.event_end_date,
        eventAmount: invoice.event_amount,
        eventDiscount: invoice.event_discount,
        advancePaid: invoice.advance_paid,
        billAmount: invoice.bill_amount,
        createdAt: invoice.created_at,
        gstPercentage: invoice.gst_percentage,
        gstAmount: invoice.gst_amount,

        customerName: invoice.customer_name,
        mobileNumber: invoice.mobile_number,

        additionalPayments: paymentRows.map( p => ({
            id: p.id,
            amount: p.amount,
            paymentDate: p.payment_date

        } )
    ),

    totalAdditionalPayment,
    pendingAmount,
    status: pendingAmount <= 0 ? "Completed" : "Pending"

    }
}


module.exports = {createInvoice, getAllInvoices, additionalPayments, getInvoiceById}