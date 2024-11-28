//500 Error de servidor 
//200 todo bien 
//201 todo bien y recurso creado 
//404 no encontrado
//400 bad request (peticion erronea)
//401 no autorizado 
//403 prohibido

const Usuario = require("../models/usuarios");

const getUsuario = async () => {
  try {
    const usuarios = await Usuario.findAll();
    return usuarios;
  } catch (error) {
    throw error;
  }
};

const createUsuario = async (nombre_usuario, contrasena) => {
  try {
    const usuario = await Usuario.create({ nombre_usuario, contrasena });
    return usuario;
  } catch (error) {
    throw error;
  }
};

const updateUsuario = async (id, nombre_usuario, contrasena) => {
  try {
    const usuario = await Usuario.update(
      { nombre_usuario, contrasena },
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
module.exports = { createUsuario ,updateUsuario, getUsuario, deleteUsuario};
   