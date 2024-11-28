const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Torres = require("./torres");

/**
 * @swagger
 * components:
 *   schemas:
 *     Pisos:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: El ID del piso.
 *         numero_piso:
 *           type: integer
 *           description: El número del piso.
 *         jefe_piso:
 *           type: string
 *           description: El nombre del jefe del piso.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de actualización.
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de eliminación (si aplica).
 *       required:
 *         - numero_piso
 *         - jefe_piso
 */



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
