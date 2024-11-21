const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Pisos = require("./pisos");

const Becas = sequelize.define(
  "becas",
  {
    nombre_beca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jefe_beca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

Becas.hasMany(Pisos, {
  foreignKey: "becaId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Pisos.belongsTo(Becas, {
  foreignKey: "becaId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Becas;
