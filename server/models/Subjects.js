const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Subjects = sequelize.define("Subjects", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    })


    Subjects.associate = (models) => {
        Subjects.belongsTo(models.Classes)
        Subjects.belongsTo(models.Institutes)
    }

    return Subjects
}