const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");
const Cuartos = require("./cuartos");

/**
 * @swagger
 * components:
 *   schemas:
 *     Torres:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: El ID de la torre.
 *         jefe_torre:
 *           type: string
 *           description: El nombre del jefe de la torre.
 *         nombre_torre:
 *           type: string
 *           description: El nombre de la torre.
 *         pisoId:
 *           type: integer
 *           description: El ID del piso asociado.
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
 *         - jefe_torre
 *         - nombre_torre
 *
 */

const Torres = sequelize.define(
  "torres",
  {
    jefe_torre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre_torre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

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
