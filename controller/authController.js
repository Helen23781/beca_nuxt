const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const { comparePassword } = require("../helpers/hashPass");
const AppError = require("../error/AppError");
const Users = require("../models/usuarios");

const generateTwoFactorSecret = async (userId) => {
  const user = await Users.findByPk(userId);
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }
  const secret = speakeasy.generateSecret({
    name: `Beca:${user.username}`,
    length: 20,
  });

  // Actualizar usuario con el nuevo secreto
  await user.update({ twoFactorSecret: secret.base32 });

  // Generar QR
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    qrCode: qrCodeUrl,
  };
};

const verifyTwoFactorToken = async (userID, code) => {
  const user = await Users.findByPk(userID);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const secret = user.twoFactorSecret;

  const isValid = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: code,
  });
  if (!isValid) {
    throw new AppError("Código inválido", 401);
  }
  await Users.update(
    { ...user, twoFactorEnabled: true },
    { where: { id: userID } }
  );
};



const login = async (nombre_usuario, contrasena) => {
  const user = await Users.findOne({
    where: {
      nombre_usuario
    },
    
  });

  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const isValidPassword = await comparePassword(contrasena, user.contrasena);

  if (!isValidPassword) {
    throw new AppError("Credenciales inválidas", 401);
  }

  // Crear payload para el JWT
  const payload = {
    id: user.id,
    nombre_usuario: user.nombre_usuario,
    role: user.role,
  };

  // Generar ambos tokens
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // token de acceso de corta duración
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1d", // token de refresco de larga duración
  });

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshTokenProvided) => {
  const decoded = jwt.verify(
    refreshTokenProvided,
    process.env.JWT_REFRESH_SECRET
  );

  const user = await Users.findOne({
    where: { id: decoded.id },
   
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  // Generar nuevo access token
  const payload = {
    id: user.id,
    nombre_usuario: user.nombre_usuario,
    role: user.role,
  };

  const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    accessToken: newAccessToken,
  };
};

const validateTwoFactorToken = async (userId, code) => {
  const user = await Users.findByPk(userId);
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  if (!user.twoFactorEnabled) {
    throw new AppError("2FA no está activado para este usuario", 400);
  }

  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
  });

  if (!isValid) {
    throw new AppError("Código inválido", 401);
  }

  return { success: true };
};

module.exports = {
  login,
  refreshToken,
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  validateTwoFactorToken,
};
