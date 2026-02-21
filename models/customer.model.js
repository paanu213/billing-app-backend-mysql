const pool = require('../config/db')

const createCustomer = async (data)=>{

    const {customerName, mobileNumber} = data;

    const [result] = await pool.execute(
        `INSERT INTO customers (customer_name, mobile_number)
        VALUES (?, ?)`,
        [
            customerName,
            mobileNumber
        ]
    )

    return result.insertId
};


const findCustomerByMobile = async (mobileNumber)=>{
    const [rows] = await pool.execute(
        `SELECT id FROM customers WHERE mobile_number = ?`,
        [mobileNumber]
    );
    return rows[0] || null;
}

module.exports = {createCustomer, findCustomerByMobile}