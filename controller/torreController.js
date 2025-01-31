const Torre = require("../models/torres");
const Piso = require("../models/pisos");
const Beca = require("../models/becas");
const Cuarto = require("../models/cuartos");

const getTorre = async () => {
  try {
    const torres = await Torre.findAll({
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
    });
    return torres;
  } catch (error) {
    throw error;
  }
};

const createTorre = async (jefe_torre, nombre_torre, pisoId) => {
  try {
    const torre = await Torre.create({
      jefe_torre,
      nombre_torre,
      pisoId,
    });
    return torre;
  } catch (error) {
    throw error;
  }
};

const updateTorre = async (id, jefe_torre, nombre_torre, pisoId) => {
  try {
    const torre = await Torre.update(
      { jefe_torre, nombre_torre, pisoId },
      { where: { id } }
    );
    return torre;
  } catch (error) {
    throw error;
  }
};

const deleteTorre = async (id) => {
  try {
    // Verificar si hay cuartos asociados a la torre
    const cuartosAsociados = await Cuarto.count({ where: { torreid: id } });
    if (cuartosAsociados > 0) {
      throw new Error(
        "No se puede eliminar la torre porque tiene cuartos asociados."
      );
    }

    const torre = await Torre.destroy({ where: { id } });
    return torre;
  } catch (error) {
    console.error("Error al eliminar la torre:", error);
    throw error;
  }
};

module.exports = { createTorre, updateTorre, getTorre, deleteTorre };
