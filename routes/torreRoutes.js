const router = require("express").Router();

const {
  createTorre,
  updateTorre,
  getTorre,
  deleteTorre,
} = require("../controller/torreController");
const AppError = require("../error/AppError");
const authenticate = require("../middlewares/authenticate");
/**
 * @swagger
 * /torres:
 *   get:
 *     summary: Obtiene una lista de torres
 *     tags:
 *       - Torre
 *     responses:
 *       200:
 *         description: Lista de torres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error de servidor
 */
router.get(
  "/torres",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const torres = await getTorre();
      res.status(200).json(torres);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /torres/create:
 *   post:
 *     summary: Crea una nueva torre
 *     tags:
 *       - Torre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jefe_torre:
 *                 type: string
 *               nombre_torre:
 *                 type: string
 *               pisoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Torre creada
 *       400:
 *         description: Todos los campos son requeridos
 *       500:
 *         description: Error de servidor
 */
router.post(
  "/torres/create",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { jefe_torre, nombre_torre, pisoId } = req.body;

      if (!jefe_torre || !nombre_torre || !pisoId) {
        throw new AppError("Todos los campos son requeridos", 400);
      }

      const torre = await createTorre(jefe_torre, nombre_torre, pisoId);
      res.status(201).json(torre);
    } catch (error) {
      next(error); //Error de servidor 500
    }
  }
);

/**
 * @swagger
 * /torres/update/{id}:
 *   put:
 *     summary: Actualiza una torre existente
 *     tags:
 *       - Torre
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la torre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jefe_torre:
 *                 type: string
 *               nombre_torre:
 *                 type: string
 *               pisoId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Torre actualizada
 *       400:
 *         description: El id es requerido o todos los campos son requeridos
 *       404:
 *         description: Torre no encontrada
 *       500:
 *         description: Error de servidor
 */
router.put(
  "/torres/update/:id",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { jefe_torre, nombre_torre, pisoId } = req.body;
      const { id } = req.params;

      if (!id) {
        throw new AppError("El id es requerido", 400);
      }

      if (!jefe_torre || !nombre_torre || !pisoId) {
        throw new AppError("Todos los campos son requeridos", 400);
      }

      const torre = await updateTorre(id, jefe_torre, nombre_torre, pisoId);
      if (torre == 0) {
        throw new AppError("Torre no encontrada", 404);
      }

      res.status(200).json({
        mensaje: "Torre actualizada",
        id: id,
        nombre_torre,
        jefe_torre,
        pisoId,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /torres/delete/{id}:
 *   delete:
 *     summary: Elimina una torre
 *     tags:
 *       - Torre
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la torre
 *     responses:
 *       200:
 *         description: Torre eliminada
 *       400:
 *         description: El id es requerido
 *       404:
 *         description: Torre no encontrada
 *       500:
 *         description: Error de servidor
 */
router.delete(
  "/torres/delete/:id",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("El id es requerido", 400);
      }

      const torre = await deleteTorre(id);
      if (torre == 0) {
        throw new AppError("Torre no encontrada", 404);
      }

      res.status(200).json({ mensaje: "Torre eliminada " });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
