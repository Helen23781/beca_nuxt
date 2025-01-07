const logger = require("../logger/logger");

const requestLogger = (req, res, next) => {
  // Registrar la información de la solicitud incluyendo la IP del cliente
  logger.info(
    `REQUEST ${req.method} ${req.path} - IP: ${req.ip}`
  );
  next();
};

module.exports = requestLogger;
