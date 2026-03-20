const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');


const Company = sequelize.define(
    "Company",
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'company_name'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
            defaultValue: DataTypes.NOW
        },
        deletedAt:{
            type: DataTypes.DATE,
            field: 'deleted_at'
        }
    }, {
        tableName: "companies",
        timestamps: true,
        paranoid: true
    }
)

module.exports = Company