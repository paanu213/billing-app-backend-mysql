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
        `INSERT INTO additional_Payments 
        (invoice_id, amount, payment_date)
        values(?, ?, ?)`,
        [
        invoiceId,
        amount,
        date || new Date()
        ]
    )
};


module.exports = {createInvoice, getAllInvoices, additionalPayments}