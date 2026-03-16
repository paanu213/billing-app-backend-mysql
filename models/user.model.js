const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')


const User = sequelize.define(
    "User", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        role: DataTypes.STRING,
        companyId: {
            type: DataTypes.INTEGER,
            field: "company_id",
            allowNull: false,
            references: {
                model: "companies",
                key: "id"
            }
        }
    }, {
        tableName: "users",
        timestamps: false
    }
)

// const createUser = async (userData)=>{

//     const {companyId, name, email, password, role} = userData;



//     const [result] = await pool.execute (
//         `
//         INSERT INTO users
//         (company_id, name, email, password, role)
//         values(?, ?, ?, ?, ?)
//         `,
//         [companyId, name, email, password, role]
//     );

//     return result.insertId;
// }


const findUserByEmail = async (email)=>{

    const [rows] = await pool.execute(
        `SELECT * FROM users
        Where email = ?`,
        [email]
    )

    return rows[0] || null
};

module.exports = User