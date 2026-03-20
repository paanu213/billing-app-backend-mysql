module.exports = (sequelize, DataTypes) => {
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
        tableName: "users",
        timestamps: true,
        paranoid: true
    }
);

User.associate = (models) => {
    User.belongsTo(models.Company,  { foreignKey : 'companyId', targetKey: 'id'  })
};

return User
}