module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define(
    "Invoice",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            field: "customer_id",
            references: {
                model: 'customers',
                key: 'id'
            }
        },
        eventType: {
            type: DataTypes.STRING,
            field: 'event_type'
        },
        eventStartDate: {
            type: DataTypes.DATE,
            field: 'event_start_date'
        },
        eventEndDate: {
            type: DataTypes.DATE,
            field: 'event_end_date'
        },
        eventAmount: {
            type: DataTypes.DECIMAL(10, 2),
            field: 'event_amount'
        },
        eventDiscount: {
            type: DataTypes.DECIMAL(10, 2),
            field: 'event_discount'
        },
        advancePaid: {
            type: DataTypes.DECIMAL(10, 2),
            field: 'advance_paid'
        },
        billAmount:{
            type: DataTypes.DECIMAL(10, 2),
            field: 'bill_amount'
        },
        gstPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            field: 'gst_percentage'
        },
        gstAmount:{
            type: DataTypes.DECIMAL(10, 2),
            field: 'gst_amount'
        },
        companyId: {
            type:  DataTypes.INTEGER,
            field: 'company_id',
            references: {
                model: 'companies',
                key: 'id'
            }
        },
        finalAmount:{
            type: DataTypes.DECIMAL(10, 2),
            field: 'final_amount'
        },
        pendingAmount: {
            type: DataTypes.DECIMAL(10, 2),
            field: 'pending_amount'
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
    },
    {
    tableName: "invoices",
    timestamps: true,
    paranoid: true
    }
);

Invoice.associate = (models) =>{
    Invoice.belongsTo(models.Company, {foreignKey: 'companyId' , targetKey: 'id' })
}

return Invoice
}
