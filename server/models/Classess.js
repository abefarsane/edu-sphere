const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Classes = sequelize.define("Classes", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    })


    Classes.associate = (models) => {
        Classes.hasMany(models.Users)
        Classes.hasMany(models.Students)
        Classes.belongsTo(models.Institutes)
        Classes.hasMany(models.Subjects)
    }

    return Classes
}