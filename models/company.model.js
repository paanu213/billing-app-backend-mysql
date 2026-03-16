const pool = require('../config/db')

const createCompany = async (companyName)=>{

    const [result] = await pool.execute(
        `
        INSERT INTO companies
        (company_name)
        values(?)`,
        [companyName]
    )

    return result.insertId
};

const findCompanyById = async(id)=>{

    const [rows] = await pool.execute(
        `Select * FROM companies
        WHERE id = ?`
        [id]
    )

    return rows[0]
}



module.exports = {createCompany, findCompanyById}