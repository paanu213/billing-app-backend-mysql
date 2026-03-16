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
        type: DataTypes.INTEGER,
        field: "mobile_number",
        unique: true
       }
    }, {
        tableName: 'customers',
        timestamps: false
    }
)

module.exports = Customer