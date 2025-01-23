const jwt = require("jsonwebtoken");
const AppError = require("../error/AppError");

const authenticate = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new AppError("Necesita iniciar sesión", 403));
    }
    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.includes(decodedToken.role)) {
        req.userData = { id: decodedToken.id };
        next();
      } else {
        return next(
          new AppError(
            "Usted no posee el rol necesario para realizar esa acción",
            403
          )
        );
      }
    } catch (error) {
      return next(new AppError("Permiso denegado", 403));
    }
  };
};

module.exports = authenticate;
