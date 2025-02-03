const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Pisos = require("./pisos");

/**
 * @swagger
 * components:
 *   schemas:
 *     Beca:
 *       type: object
 *       properties:
 *         nombre_beca:
 *           type: string
 *           description: El nombre de la beca.
 *         jefe_beca:
 *           type: string
 *           description: El nombre del jefe de la beca.
 *       required:
 *         - nombre_beca
 *         - jefe_beca
 *       example:
 *         nombre_beca: "Beca de Excelencia"
 *         jefe_beca: "Juan Pérez"
 */
const Becas = sequelize.define(
  "becas",
  {
    nombre_beca: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
