const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Torres = require("./torres");

const Pisos = sequelize.define(
  "pisos",
  {
    numero_piso: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jefe_piso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

Pisos.hasMany(Torres, {
  foreignKey: "pisoId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Torres.belongsTo(Pisos, {
  foreignKey: "pisoId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
module.exports = Pisos;
