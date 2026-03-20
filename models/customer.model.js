const {DataTypes, INTEGER} = require('sequelize')
const sequelize = require('../config/db');

const Customer = sequelize.define(
    "Customer",
    {
       id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
       },
       customerName: {
        type: DataTypes.STRING,
        field: "customer_name" 
       },
       mobileNumber: {
        type: DataTypes.STRING(15),
        field: "mobile_number",
        unique: true
       },
       companyId: {
        type: DataTypes.INTEGER,
        field: 'company_id',
        allowNull: true,
        references: {
             model: 'companies',
             key: 'id'
            }
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
        tableName: 'customers',
        timestamps: true,
        paranoid: true
    }
)

module.exports = Customer