const Estudiantes = require("../models/estudiantes");
const Cuarto = require("../models/cuartos");
const Torre = require("../models/torres");
const Piso = require("../models/pisos");
const Beca = require("../models/becas");

const getEstudiantes = async () => {
  try {
    const estudiantes = await Estudiantes.findAll({
      include: [
        {
          model: Cuarto,
          include: [
            {
              model: Torre,
              include: [
                {
                  model: Piso,
                  include: [
                    {
                      model: Beca,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    return estudiantes;
  } catch (error) {
    throw error;
  }
};

const createEstudiante = async (
  nombre_estudiante,
  apellido_estudiante,
  anio_academico,
  edad,
  carrera,
  facultad,
  cuartoId,
  foto
) => {
  try {
    const estudiante = await Estudiantes.create({
      nombre_estudiante,
      apellido_estudiante,
      anio_academico,
      edad,
      carrera,
      facultad,
      cuartoId,
      foto,
    });
    return estudiante;
  } catch (error) {
    throw error;
  }
};

const updateEstudiante = async (
  id,
  nombre_estudiante,
  apellido_estudiante,
  anio_academico,
  edad,
  carrera,
  facultad,
  cuartoId,
  foto
) => {
  try {
    const estudiante = await Estudiantes.update(
      {
        nombre_estudiante,
        apellido_estudiante,
        anio_academico,
        edad,
        carrera,
        facultad,
        cuartoId,
        foto,
      },
      { where: { id } }
    );
    return estudiante;
  } catch (error) {
    throw error;
  }
};

const deleteEstudiante = async (id) => {
  try {
    const estudiante = await Estudiantes.destroy({ where: { id } });
    return estudiante;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  createEstudiante,
  updateEstudiante,
  getEstudiantes,
  deleteEstudiante,
 
};
