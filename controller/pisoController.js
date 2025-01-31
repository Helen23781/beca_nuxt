const Piso = require("../models/pisos");
const Torre = require("../models/torres");
const AppError = require("../error/AppError");

const getPiso = async () => {
  try {
    const pisos = await Piso.findAll();
    return pisos;
  } catch (error) {
    throw error;
  }
};

const createPiso = async (numero_piso, jefe_piso, becaId) => {
  try {
    const piso = await Piso.create({ numero_piso, jefe_piso, becaId });
    return piso;
  } catch (error) {
    throw error;
  }
};

const updatePiso = async (id, numero_piso, jefe_piso, becaId) => {
  try {
    const piso = await Piso.update(
      { numero_piso, jefe_piso, becaId },
      { where: { id } }
    );
    return piso;
  } catch (error) {
    throw error;
  }
};

const deletePiso = async (id) => {
  try {
    // Verificar si hay torres asociadas al piso
    const torresAsociadas = await Torre.count({ where: { pisoId: id } });
    if (torresAsociadas > 0) {
      throw new AppError(
        "No se puede eliminar el piso cuando tiene torres asociadas.",
        400
      );
    }
    const piso = await Piso.destroy({ where: { id } });
    return piso;
  } catch (error) {
    throw error;
  }
};

module.exports = { createPiso, updatePiso, getPiso, deletePiso };
