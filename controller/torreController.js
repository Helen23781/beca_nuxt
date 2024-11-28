const Torre = require("../models/torres");

const getTorre = async () => {
  try {
    const torres = await Torre.findAll();
    return torres;
  } catch (error) {
    throw error;
  }
};

const createTorre = async (jefe_torre, nombre_torre, pisoId) => {
  try {
    const torre = await Torre.create({ jefe_torre, nombre_torre, pisoId });
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
    const torre = await Torre.destroy({ where: { id } });
    return torre;
  } catch (error) {
    throw error;
  }
};
module.exports = { createTorre, updateTorre, getTorre, deleteTorre };
