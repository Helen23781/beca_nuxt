"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("admin", 10); // Cambia 'admin123' por la contraseña que desees

    return queryInterface.bulkInsert(
      "usuarios",
      [
        {
          nombre_usuario: "admin",
          contrasena: hashedPassword,
          role: "administrador",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      "usuarios",
      { nombre_usuario: "admin" },
      {}
    );
  },
};
