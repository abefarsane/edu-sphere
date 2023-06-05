const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Roles = sequelize.define("Roles", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role_name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        role_description: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    })


    Roles.associate = (models) => {
        Roles.hasMany(models.Users)
    }

    return Roles
}