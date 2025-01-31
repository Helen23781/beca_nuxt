const AppError = require("../error/AppError");
const Cuarto = require("../models/cuartos");
const Torre = require("../models/torres");
const Piso = require("../models/pisos");
const Beca = require("../models/becas");
const Estudiantes = require("../models/estudiantes");

const getCuarto = async () => {
  try {
    const cuartos = await Cuarto.findAll({
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
    });
    return cuartos;
  } catch (error) {
    throw error;
  }
};

const createCuarto = async (numero_cuarto, capacidad_maxima, torreid) => {
  try {
    const cuarto = await Cuarto.create({
      numero_cuarto,
      capacidad_maxima,
      torreid,
    });
    return cuarto;
  } catch (error) {
    throw error;
  }
};

const updateCuarto = async (id, numero_cuarto, capacidad_maxima, torreid) => {
  try {
    const cuarto = await Cuarto.update(
      { numero_cuarto, capacidad_maxima, torreid },
      { where: { id } }
    );
    return cuarto;
  } catch (error) {
    throw error;
  }
};
const deleteCuarto = async (id) => {
  try {
    // Verificar si hay estudiantes asociados al cuarto
    const estudiantesAsociados = await Estudiantes.count({
      where: { cuartoId: id },
    });
    if (estudiantesAsociados > 0) {
      throw new AppError(
        "No se puede eliminar el cuarto porque tiene estudiantes asociados.",
        400
      );
    }

    const cuarto = await Cuarto.destroy({ where: { id } });
    return cuarto;
  } catch (error) {
    console.error("Error al eliminar el cuarto:", error);
    throw error;
  }
};

const getCuartosPorTorre = async (torreid) => {
  try {
    // Verificar si hay pisos asociados a la beca
    const estudiantesAsociados = await Estuadiantes.count({
      where: { cuartoId: id },
    });
    if (estudiantesAsociados > 0) {
      throw new AppError(
        "No se puede eliminar el cuarto cuando esta tiene datos dentro.",
        400
      );
    }
    const cuartos = await Cuarto.findAll({
      where: { torreid: torreid },
    });
    return cuartos;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCuarto,
  updateCuarto,
  getCuarto,
  deleteCuarto,
  getCuartosPorTorre,
};
