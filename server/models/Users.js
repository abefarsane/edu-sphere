const { INTEGER } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
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
            allowNull: false
        }
    })


    Users.associate = function(models) {
        Users.belongsTo(models.Institutes,{
            foreignKey: {
                allowNull: true
              }
        })
        Users.belongsTo(models.Classes,{
            foreignKey: {
                allowNull: true
            }
        }) 
    };

    return Users
}