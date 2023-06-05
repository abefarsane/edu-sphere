const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Assignments = sequelize.define("Assignments", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    })


    Assignments.associate = (models) => {
        Assignments.belongsTo(models.Classes)
        Assignments.belongsTo(models.Subjects)
        Assignments.belongsTo(models.ClassPrograms)
    }

    return Assignments
}