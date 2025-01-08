const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

/**
 * @swagger
 * components:
 *   schemas:
 *     Estudiantes:
 *       type: object
 *       properties:
 *         nombre_estudiante:
 *           type: string
 *           description: El nombre del estudiante.
 *           example: "Juan"
 *         apellido_estudiante:
 *           type: string
 *           description: El apellido del estudiante.
 *           example: "Pérez"
 *         anio_academico:
 *           type: string
 *           description: El año académico del estudiante.
 *           example: "2023"
 *         edad:
 *           type: string
 *           description: La edad del estudiante.
 *           example: "20"
 *         carrera:
 *           type: string
 *           description: La carrera que estudia el estudiante.
 *           example: "Ingeniería"
 *         facultad:
 *           type: string
 *           description: La facultad a la que pertenece el estudiante.
 *           example: "Facultad de Ingeniería"
 *
 *       required:
 *         - nombre_estudiante
 *         - apellido_estudiante
 *         - anio_academico
 *         - edad
 *         - carrera
 *         - facultad
 *
 */
const Estudiantes = sequelize.define(
  "estudiantes",
  {
    nombre_estudiante: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido_estudiante: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    anio_academico: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    edad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    carrera: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facultad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Otros campos del modelo Estudiantes
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Estudiantes;
