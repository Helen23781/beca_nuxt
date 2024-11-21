const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Cuartos = require("./cuartos")

const Torres = sequelize.define("torres", {
    jefe_torre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nombre_torre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
}, {
    timestamps: true,
    paranoid: true,
});
Torres.hasMany(Cuartos, {
    foreignKey: "torreid",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Cuartos.belongsTo(Torres, {
    foreignKey: "torreid",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
module.exports = Torres;