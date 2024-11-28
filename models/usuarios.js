const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: El ID del usuario.
 *         nombre_usuario:
 *           type: string
 *           description: El nombre de usuario.
 *         contrasena:
 *           type: string
 *           description: La contraseña del usuario.
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
 */


const Usuarios = sequelize.define("usuarios", {
    nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
}, {
    timestamps: true,
    paranoid: true,
});

module.exports = Usuarios;