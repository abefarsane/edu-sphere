const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Grades = sequelize.define("Grades", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    })


    Grades.associate = (models) => {
        Grades.belongsTo(models.Classes)
        Grades.belongsTo(models.Subjects)
        Grades.belongsTo(models.Students)
        Grades.belongsTo(models.ClassPrograms)
    }

    return Grades
}