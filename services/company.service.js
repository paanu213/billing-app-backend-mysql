const pool = require('../config/db');
const bcrypt = require('bcrypt');
const companyModel = require('../models/company.model')

const createCompanyWithAdmin = async (data)=>{
    console.log("SERVICE DATA:", data);

    const connection = await pool.getConnection();

    try{
        await connection.beginTransaction()

        const {companyName, name, email, password} = data;

        if(!companyName || !name || !email || !password) {
            throw new Error ('All fields are required')
        }

        const [existingUser] = await connection.execute(
            `SELECT * FROM users WHERE email = ?`, [email]
        )

        if (existingUser.length > 0){
            throw new Error ('User already created with this email. use a different email')
        }
        
        const [companyResult] = await connection.execute(
            `
            INSERT INTO companies(company_name) value(?)
            `, [companyName]
        )

        const companyId = companyResult.insertId

        const hashPassword = await bcrypt.hash(password, 12)

        await connection.execute(
            `
            INSERT INTO users
            (company_id, name, email, password, role) values(?, ?, ?, ?, ?)`,
            [companyName, name, email, hashPassword, 'company_admin']
        )

        await connection.commit();

        return companyId;
    
}
catch (error){
    await connection.rollback();
    throw error;
}
finally { connection.release()}
}

module.exports = {createCompanyWithAdmin}