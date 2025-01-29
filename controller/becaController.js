//500 Error de servidor
//200 todo bien
//201 todo bien y recurso creado
//404 no encontrado
//400 bad request (peticion erronea)
//401 no autorizado
//403 prohibido

const AppError = require("../error/AppError");
const Beca = require("../models/becas");
const Pisos = require("../models/pisos");

const getBeca = async () => {
  try {
    const becas = await Beca.findAll({
      attributes: ["id", "nombre_beca", "jefe_beca"],
    });
    return becas;
  } catch (error) {
    throw error;
  }
};

const createBeca = async (nombre_beca, jefe_beca) => {
  try {
    const beca = await Beca.create({ nombre_beca, jefe_beca });
    return beca;
  } catch (error) {
    throw error;
  }
};

const updateBeca = async (id, nombre_beca, jefe_beca) => {
  try {
    const beca = await Beca.update(
      { nombre_beca, jefe_beca },
      { where: { id } }
    );
    return beca;
  } catch (error) {
    throw error;
  }
};

const deleteBeca = async (id) => {
  try {
    // Verificar si hay pisos asociados a la beca
    const pisosAsociados = await Pisos.count({ where: { becaId: id } });
    if (pisosAsociados > 0) {
      throw new AppError(
        "No se puede eliminar la beca cuando esta tiene datos dentro.",
        400
      );
    }

    const beca = await Beca.destroy({ where: { id } });
    return beca;
  } catch (error) {
    throw error;
  }
};

module.exports = { createBeca, updateBeca, getBeca, deleteBeca };
