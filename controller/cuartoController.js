const Cuarto = require("../models/cuartos");

const getCuarto = async () => {
  try {
    const cuartos = await Cuarto.findAll();
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
    const cuarto = await Cuarto.destroy({ where: { id } });
    return cuarto;
  } catch (error) {
    throw error;
  }
};
module.exports = { createCuarto, updateCuarto, getCuarto, deleteCuarto };
