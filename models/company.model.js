module.exports = (sequelize, DataTypes) =>{
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
);

Company.associate = (models)=>{
    Company.hasMany(models.User, {foreignKey: 'companyId'});
    Company.hasMany(models.Invoice, {foreignKey: 'companyId'});
    Company.hasMany(models.Payments, {foreignKey: 'companyId'});
    Company.hasMany(models.Customer, {foreignKey: 'companyId'});
};

Company.addHook('afterDestroy', async (company, options) => {
    // This looks up the other models automatically
    const { User, Invoice, Customer } = company.sequelize.models;

    // Soft delete all linked records
    await User.destroy({ where: { companyId: company.id }, transaction: options.transaction });
    await Invoice.destroy({ where: { companyId: company.id }, transaction: options.transaction });
    await Customer.destroy({ where: { companyId: company.id }, transaction: options.transaction });
});

return Company
}