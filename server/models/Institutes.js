const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Institutes = sequelize.define("Institutes", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING(2000),
            allowNull: true
        }
    })


    Institutes.associate = (models) => {
        Institutes.hasMany(models.Users)
        Institutes.hasMany(models.Classes)
        Institutes.belongsTo(models.Users, {
            as: "admin"
        })
    }

    return Institutes
}