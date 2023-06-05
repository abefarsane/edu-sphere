const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Students = sequelize.define("Students", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        pwd: {
            type: DataTypes.STRING(200),
            allowNull: false
        }, 
        phone_number: {
            type: DataTypes.STRING(200),
            allowNull: true
        }
    })


    Students.associate = (models) => {
        Students.belongsTo(models.Classes)
        Students.belongsTo(models.Institutes)
    }

    return Students
}