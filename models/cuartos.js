const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");
const Estudiantes = require("./estudiantes");
/**
 * @swagger
 * components:
 *   schemas:
 *     Cuartos:
 *       type: object
 *       properties:
 *         numero_cuarto:
 *           type: integer
 *           description: El número del cuarto.
 *           example: 101
 *         capacidad_maxima:
 *           type: integer
 *           description: La capacidad máxima del cuarto.
 *           example: 2
 *       required:
 *         - numero_cuarto
 *         - capacidad_maxima
 */

const Cuartos = sequelize.define(
  "cuartos",
  {
    numero_cuarto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacidad_maxima: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

Cuartos.hasMany(Estudiantes, {
  foreignKey: "cuartoid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Estudiantes.belongsTo(Cuartos, {
  foreignKey: "cuartoid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Cuartos;
