const sequelize = require("./helpers/database.js"); 
const express = require("express");


//importacion de los modelos

const Cuartos = require("./models/cuartos.js")
const Torres = require("./models/torres.js")
const Pisos = require("./models/pisos.js")
const Becas = require("./models/becas.js")

const app = express()



app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000')
    console.log('http://localhost:3000')
  })

  // Sincronizar los modelos para verificar la conexión con la base de datos
 sequelize
 .sync({ alter: true })
 .then(() => {
 console.log("Todos los modelos se sincronizaron correctamente.");
 }) .catch((err) => {
 console.log("Ha ocurrido un error al sincronizar los modelos: ", err); 
});

  