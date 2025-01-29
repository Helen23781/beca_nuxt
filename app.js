const sequelize = require("./helpers/database.js");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

//Importacion de Winston
const errorHandler = require("./middlewares/errorHandler.js");
const requestLogger = require("./middlewares/requestLogger.js");

//Importacion de el cors
require("dotenv").config();

//importacion de los modelos
const Estudiantes = require("./models/estudiantes.js");
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
const estudianteRoutes = require("./routes/estudianteRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definición de corsOptions

// Uso de Cors
const allowsOrigins = [
  "https://beca-nuxt-fontend3.onrender.com",
  "http://localhost:3000",
  "*",
];
app.use(
  cors({
    origin: allowsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//Middleware de la aplicacion

app.use(requestLogger);
//uso de las rutas
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", usuarioRoutes);
app.use("/", becaRoutes);
app.use("/", pisoRoutes);
app.use("/", torreRoutes);
app.use("/", cuartoRoutes);
app.use("/", estudianteRoutes);
app.use("/", authRoutes);

app.use(errorHandler);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Uso del middleware de requestLogger

app.listen(process.env.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${process.env.PORT}`);
  console.log(`http://localhost:${process.env.PORT}`);
  console.log(
    `Documentacion de swagger: http://localhost:${process.env.PORT}/api-docs`
  );
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
