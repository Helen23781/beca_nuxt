const router = require("express").Router();
const {
  createPiso,
  deletePiso,
  getPiso,
  updatePiso,
} = require("../controller/pisoController");
const AppError = require("../error/AppError");

/**
 * @swagger
 * /pisos:
 *   get:
 *     summary: Obtiene una lista de pisos
 *     tags:
 *       - Piso
 *     responses:
 *       200:
 *         description: Lista de pisos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error de servidor
 */
router.get("/pisos", async (req, res, next) => {
  try {
    const pisos = await getPiso();
    res.status(200).json(pisos);
  } catch (error) {
    next(error); //Error de servidor 500
  }
});

/**
 * @swagger
 * /pisos/create:
 *   post:
 *     summary: Crea un nuevo piso
 *     tags:
 *       - Piso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_piso:
 *                 type: string
 *               jefe_piso:
 *                 type: string
 *               becaId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Piso creado
 *       400:
 *         description: Todos los campos son requeridos
 *       500:
 *         description: Error de servidor
 */
router.post(
  "/pisos/create",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { numero_piso, jefe_piso, becaId } = req.body;

      if (!numero_piso || !jefe_piso || !becaId) {
        throw new AppError("Todos los campos son requeridos", 400);
      }
      const piso = await createPiso(numero_piso, jefe_piso, becaId);
      res.status(201).json(piso);
    } catch (error) {
      next(error); //Error de servidor 500
    }
  }
);

/**
 * @swagger
 * /pisos/update/{id}:
 *   put:
 *     summary: Actualiza un piso existente
 *     tags:
 *       - Piso
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del piso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_piso:
 *                 type: string
 *               jefe_piso:
 *                 type: string
 *               becaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Piso actualizado
 *       400:
 *         description: El id es requerido o todos los campos son requeridos
 *       404:
 *         description: Piso no encontrado
 *       500:
 *         description: Error de servidor
 */
router.put(
  "/pisos/update/:id",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { numero_piso, jefe_piso, becaId } = req.body;
      const { id } = req.params;

      if (!id) {
        throw new AppError("El id es requerido", 400);
      }

      if (!numero_piso || !jefe_piso || !becaId) {
        throw new AppError("Todos los campos son requeridos", 400);
      }

      const piso = await updatePiso(id, numero_piso, jefe_piso, becaId);
      if (piso == 0) {
        throw new AppError("Piso no encontrado", 404);
      }

      res.status(200).json({
        mensaje: "Piso actualizado",
        id: id,
        numero_piso,
        jefe_piso,
        becaId,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /pisos/delete/{id}:
 *   delete:
 *     summary: Elimina un piso
 *     tags:
 *       - Piso
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del piso
 *     responses:
 *       200:
 *         description: Piso eliminado
 *       400:
 *         description: El id es requerido
 *       404:
 *         description: Piso no encontrado
 *       500:
 *         description: Error de servidor
 */
router.delete(
  "/pisos/delete/:id",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("El id es requerido", 400);
      }

      const piso = await deletePiso(id);
      if (piso == 0) {
        throw new AppError("Piso no encontrado", 404);
      }

      res.status(200).json({ mensaje: "Piso eliminado " });
    } catch (error) {
      next(error); //Error de servidor 500
    }
  }
);

module.exports = router;
