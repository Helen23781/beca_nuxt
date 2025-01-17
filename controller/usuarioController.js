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
    const usuarios = await Usuario.findAll();
    return usuarios;
  } catch (error) {
    throw error;
  }
};
const getUsuarioById = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    return usuario;
  } catch (error) {
    throw error;
  }
};

const createUsuario = async (nombre_usuario, contrasena, role) => {
  try {
    const hashedPass = await hashPassword(contrasena);
    console.log(hashedPass)
    const usuario = await Usuario.create({ nombre_usuario, contrasena:hashedPass, role });
    return usuario;
  } catch (error) {
    throw error;
  }
};

const updateUsuario = async (id, nombre_usuario, contrasena, role) => {
  try {
    const hashedPass = await hashPassword(contrasena)

    const usuario = await Usuario.update(
      { nombre_usuario, hashedPass, role },
      { where: { id } }
    );
    return usuario;
  } catch (error) {
    throw error;
  }
};

const deleteUsuario = async (id) => {
    try {
      const usuario = await Usuario.destroy(
        { where: { id } }
      );
      return usuario;
    } catch (error) {
      throw error;
    }
  };
module.exports = { createUsuario ,updateUsuario, getUsuario, deleteUsuario, getUsuarioById};
   