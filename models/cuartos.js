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
const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Cuartos = sequelize.define("cuartos", {
    numero_cuarto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
   capacidad_maxima: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    
}, {
    timestamps: true,
    paranoid: true,
});


module.exports = Cuartos;