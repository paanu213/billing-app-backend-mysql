const pool = require('../config/db')

const company = async (companyName)=>{

    const [result] = await pool.execute(
        `
        INSERT INTO companies
        (company_name)
        values(?)`,
        [companyName]
    )

    console.log(result)

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

const companiesList = async ()=>{
    const [companiesRows] = await pool.execute(
        `SELECT * FROM companies`
    )
    return companiesRows
}

const companyDeletebyid = async (id)=>{
    const [deleteCompany] = await pool.execute(
        `DELETE FROM companies WHERE id = ?`
        [id]
    )

    return 'company Deleted'
}


module.exports = {company, findCompanyById, companiesList, companyDeletebyid}