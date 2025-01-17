const AppError = require("../error/AppError");
const router = require("express").Router();
const {
  login,
  refreshToken,
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  validateTwoFactorToken,
} = require("../controller/authController");
const authenticate = require("../middlewares/authenticate");
const { getUsuarioById, } = require("../controller/usuarioController");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 description: Username o email del usuario
 *                 example: elena
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: 123
 *             required:
 *               - nombre_usuario
 *               - contrasena
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token de acceso (duración 15 minutos)
 *                   example: "Bearer eyJhbGciOiJIUzI1NiIs..."
 *                 refreshToken:
 *                   type: string
 *                   description: Token de refresco (duración 7 días)
 *                   example: "Bearer eyJhbGciOiJIUzI1NiIs..."
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Datos faltantes
 */
router.post("/auth/login", async (req, res, next) => {
  try {
    const { nombre_usuario, contrasena } = req.body;

    if (!nombre_usuario || !contrasena) {
      throw new AppError("nombre_usuario and password are required", 400);
    }

    const { accessToken, refreshToken } = await login(nombre_usuario, contrasena);

    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refrescar el token de autenticación
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     description: Utiliza el refresh token para obtener un nuevo access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshTokenProvided:
 *                 type: string
 *                 example: "Bearer eyJhbGciOiJIUzI1NiIs..."
 *             required:
 *               - refreshTokenProvided
 *     responses:
 *       200:
 *         description: Token refrescado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Nuevo token de acceso
 *                   example: "Bearer eyJhbGciOiJIUzI1NiIs..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                     person:
 *                       type: object
 *                       properties:
 *                         first_name:
 *                           type: string
 *                         last_name:
 *                           type: string
 *                         gender:
 *                           type: string
 *       401:
 *         description: Token inválido o no proporcionado
 *       404:
 *         description: Usuario no encontrado
 */
router.post("/auth/refreshToken", async (req, res, next) => {
  try {
    const refreshTokenProvided = req.body.refreshToken;

    if (!refreshTokenProvided) {
      throw new AppError("No refresh token provided", 401);
    }

    const { accessToken, user } = await refreshToken(refreshTokenProvided);

    res.status(200).json({
      accessToken: accessToken,
      user,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError(
          "Refresh token expirado, por favor inicie sesión nuevamente",
          401
        )
      );
    }
    next(error);
  }
});

/**
 * @swagger
 * /session:
 *   get:
 *     summary: Obtener datos de la sesión del usuario actual
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     person:
 *                       type: object
 *                       properties:
 *                         first_name:
 *                           type: string
 *                         last_name:
 *                           type: string
 *                         gender:
 *                           type: string
 *       401:
 *         description: No autorizado
 */
router.get(
  "/session",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const sessionData = await getUsuarioById(req.userData.id);
      res.status(200).json(sessionData);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión del usuario
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 */
router.post(
  "/auth/logout",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      res.status(200).json({
        success: true,
        message: "Sesión cerrada exitosamente",
      });
    } catch (error) {
      next(error);
    }
  }
);


/**
 * @swagger
 * /auth/2fa/generate:
 *   post:
 *     summary: Generar secreto 2FA
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Secreto 2FA generado exitosamente
 */
router.post(
  "/auth/2fa/generate",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      
      const { secret, qrCode } = await generateTwoFactorSecret(
        req.userData.id
      );
      res.json({ secret, qrCode });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /auth/2fa/verify:
 *   post:
 *     summary: Verificar y activar 2FA
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 */
router.post(
  "/auth/2fa/verify",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { code } = req.body;
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(new AppError("Token must me provide", 401));
      }
      const token = authHeader.split(" ")[1];

      await verifyTwoFactorToken(req.userData.id, code);

      res.json({ message: "2FA activado exitosamente" });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /auth/2fa/validate:
 *   post:
 *     summary: Validar código 2FA
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código 2FA a validar
 *     responses:
 *       200:
 *         description: Código validado exitosamente
 *       401:
 *         description: Código inválido
 *       400:
 *         description: 2FA no activado
 */
router.post(
  "/auth/2fa/validate",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { code } = req.body;
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(new AppError("Token debe ser proporcionado", 401));
      }
      const token = authHeader.split(" ")[1];

      const result = await validateTwoFactorToken(
        req.userData.id,
        code
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
