const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Payments = sequelize.define(
    "Payments",
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        amount:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.00
        },
        paymentDate:{
            field: 'payment_date',
            type: DataTypes.DATEONLY
        },
        invoiceId: {
            type: DataTypes.INTEGER,
            field: 'invoice_id',
            references: {
                model: 'invoices',
                key: 'id'
            }
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
        tableName: "additional_payments",
        timestamps: true,
        paranoid: true
    }
)

module.exports = Payments