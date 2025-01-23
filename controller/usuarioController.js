//500 Error de servidor
//200 todo bien
//201 todo bien y recurso creado
//404 no encontrado
//400 bad request (peticion erronea)
//401 no autorizado
//403 prohibido

const { hashPassword } = require("../helpers/hashPass");
const Usuario = require("../models/usuarios");

const getUsuario = async () => {
  try {
    const usuarios = await Usuario.findAll({ exclude: ["contrasena"] });
    return usuarios;
  } catch (error) {
    throw error;
  }
};
const getUsuarioById = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id, { exclude: ["contrasena"] });
    return usuario;
  } catch (error) {
    throw error;
  }
};

const createUsuario = async (nombre_usuario, contrasena, role) => {
  try {
    const hashedPass = await hashPassword(contrasena);
    console.log(hashedPass);
    const usuario = await Usuario.create({
      nombre_usuario,
      contrasena: hashedPass,
      role,
    });
    return usuario;
  } catch (error) {
    throw error;
  }
};

const updateUsuario = async (id, nombre_usuario, contrasena, role) => {
  try {
    let updateData = { nombre_usuario, role };

    if (contrasena !== null) {
      const hashedPass = await hashPassword(contrasena);
      updateData.contrasena = hashedPass;
    }

    const usuario = await Usuario.update(updateData, { where: { id } });
    return usuario;
  } catch (error) {
    throw error;
  }
};

const deleteUsuario = async (id) => {
  try {
    const usuario = await Usuario.destroy({ where: { id } });
    return usuario;
  } catch (error) {
    throw error;
  }
};

const updateMiCuenta = async (id, nombre_usuario, contrasena) => {
  try {
    let updateData = {};

    if (nombre_usuario) {
      updateData.nombre_usuario = nombre_usuario;
    }

    if (contrasena) {
      const hashedPass = await hashPassword(contrasena);
      updateData.contrasena = hashedPass;
    }

    const [updated] = await Usuario.update(updateData, { where: { id } });
    return updated ? await getUsuarioById(id) : null;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUsuario,
  updateUsuario,
  getUsuario,
  deleteUsuario,
  getUsuarioById,
  updateMiCuenta,
};
