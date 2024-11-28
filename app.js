const sequelize = require("./helpers/database.js");
const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const cors = require("cors");

//Importacion de Winston
const errorHandler = require("./middlewares/errorHandler.js");

//Importacion de el cors
require("dotenv").config();

//importacion de los modelos

const Cuartos = require("./models/cuartos.js");
const Torres = require("./models/torres.js");
const Pisos = require("./models/pisos.js");
const Becas = require("./models/becas.js");

const Usuarios = require("./models/usuarios.js");

// Importacion de las rutas
const usuarioRoutes = require("./routes/usuarioRoutes.js");
const becaRoutes = require("./routes/becaRoutes.js");
const pisoRoutes = require("./routes/pisoRoutes.js");
const torreRoutes = require("./routes/torreRoutes.js");
const cuartoRoutes = require("./routes/cuartoRoutes.js");

//Swagger definitions
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Beca API",
      description: "API backend for Beca project",
      version: "1.0.0",
      contact: {
        name: "Elena Cardenas Cruz",
        email: "cardenaselena247@gmail.com",
        url: "",
      },
    },
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definición de corsOptions

// Uso de Cors
const allowsOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: allowsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//Middleware de la aplicacion

//uso de las rutas
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", usuarioRoutes);
app.use("/", becaRoutes);
app.use("/", pisoRoutes);
app.use("/", torreRoutes);
app.use("/", cuartoRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
  console.log("http://localhost:3000");
  console.log("Documentacion de swagger: http://localhost:3000/api-docs");
});

// Sincronizar los modelos para verificar la conexión con la base de datos
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Todos los modelos se sincronizaron correctamente.");
  })
  .catch((err) => {
    console.log("Ha ocurrido un error al sincronizar los modelos: ", err);
  });


