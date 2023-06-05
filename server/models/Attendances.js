const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Attendances = sequelize.define("Attendances", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING(200),
            allowNull: true
        }
    }) 


    Attendances.associate = (models) => {
        Attendances.belongsTo(models.Classes)
        Attendances.belongsTo(models.Students)
    }

    return Attendances
}