const pool = require('../config/db')

const createUser = async (userData)=>{

    const {companyId, name, email, password, role} = userData;

    const [result] = await pool.execute (
        `
        INSERT INTO users
        (company_id, name, email, password, role)
        values(?, ?, ?, ?, ?)
        `,
        [companyId, name, email, password, role]
    );

    return result.insertId;
}


const findUserByEmail = async (email)=>{

    const [rows] = await pool.execute(
        `SELECT * FROM users
        Where email = ?`,
        [email]
    )

    return rows[0] || null
};

module.exports = {createUser, findUserByEmail}