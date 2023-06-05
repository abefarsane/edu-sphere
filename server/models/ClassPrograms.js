const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const ClassPrograms = sequelize.define("ClassPrograms", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        period_title: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        date_from: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        date_to: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING(500),
            allowNull: false
        }
    })


    ClassPrograms.associate = (models) => {
        ClassPrograms.belongsTo(models.Classes)
        ClassPrograms.belongsTo(models.Subjects)
    }

    return ClassPrograms
}