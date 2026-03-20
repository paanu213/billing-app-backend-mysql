module.exports = (sequelize, DataTypes) =>{
    const Service = sequelize.define(
        "Service",
        {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                required: true
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                required: true
            }
        }
    )
    
    return Service
}

    

