const router = require("express").Router();

const {
  createCuarto,
  deleteCuarto,
  getCuarto,
  updateCuarto,
  getCuartosPorTorre,
} = require("../controller/cuartoController");
const AppError = require("../error/AppError");
const authenticate = require("../middlewares/authenticate");
/**
 * @swagger
 * /cuartos:
 *   get:
 *     summary: Obtiene una lista de cuartos
 *     tags:
 *       - Cuarto
 *     responses:
 *       200:
 *         description: Lista de cuartos
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
  "/cuartos",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const cuartos = await getCuarto();
      res.status(200).json(cuartos);
    } catch (error) {
      next(error); //Error de servidor 500
    }
  }
);

/**
 * @swagger
 * /cuartos/create:
 *   post:
 *     summary: Crea un nuevo cuarto
 *     tags:
 *       - Cuarto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_cuarto:
 *                 type: string
 *               capacidad_maxima:
 *                 type: integer
 *               torreid:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Cuarto creado
 *       400:
 *         description: Todos los campos son requeridos
 *       500:
 *         description: Error de servidor
 */
router.post(
  "/cuartos/create",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { numero_cuarto, capacidad_maxima, torreid } = req.body;

      if (!numero_cuarto || !capacidad_maxima || !torreid) {
        throw new AppError("Todos los campos son requeridos", 400);
      }

      const cuarto = await createCuarto(
        numero_cuarto,
        capacidad_maxima,
        torreid
      );
      res.status(201).json(cuarto);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /cuartos/update/{id}:
 *   put:
 *     summary: Actualiza un cuarto existente
 *     tags:
 *       - Cuarto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cuarto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_cuarto:
 *                 type: string
 *               capacidad_maxima:
 *                 type: integer
 *               torreId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cuarto actualizado
 *       400:
 *         description: El id es requerido o todos los campos son requeridos
 *       404:
 *         description: Cuarto no encontrado
 *       500:
 *         description: Error de servidor
 */
router.put(
  "/cuartos/update/:id",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    //:id es para recibir parámetros
    try {
      const { numero_cuarto, capacidad_maxima, torreid } = req.body;
      const { id } = req.params;

      if (!id) {
        throw new AppError("El id es requerido", 400);
      }

      if (!numero_cuarto || !capacidad_maxima || !torreid) {
        throw new AppError("Todos los campos son reuqeridos", 400);
      }
      const cuarto = await updateCuarto(
        id,
        numero_cuarto,
        capacidad_maxima,
        torreid
      );
      if (cuarto == 0) {
        throw new AppError("Cuarto no encontrado", 404);
      }

      res.status(200).json({
        mensaje: "Cuarto actualizado",
        id: id,
        numero_cuarto,
        capacidad_maxima,
        torreid,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /cuartos/delete/{id}:
 *   delete:
 *     summary: Elimina un cuarto
 *     tags:
 *       - Cuarto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cuarto
 *     responses:
 *       200:
 *         description: Cuarto eliminado
 *       400:
 *         description: El id es requerido
 *       404:
 *         description: Cuarto no encontrado
 *       500:
 *         description: Error de servidor
 */
router.delete(
  "/cuartos/delete/:id",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    //:id es para recibir parámetros
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("El id es requerido", 400);
      }

      const cuarto = await deleteCuarto(id);
      if (cuarto == 0) {
        throw new AppError("Cuarto no encontrado", 404);
      }

      res.status(200).json({ mensaje: "Cuarto eliminado " });
    } catch (error) {
      next(error); //Error de servidor 500
    }
  }
);

/**
 * @swagger
 * /cuartos/torre/{torreId}:
 *   get:
 *     summary: Obtiene una lista de cuartos por torre
 *     tags:
 *       - Cuarto
 *     parameters:
 *       - in: path
 *         name: torreId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la torre
 *     responses:
 *       200:
 *         description: Lista de cuartos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Cuartos no encontrados
 *       500:
 *         description: Error de servidor
 */
router.get(
  "/cuartos/torre/:torreId",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { torreId } = req.params;
      const cuartos = await getCuartosPorTorre(torreId);
      if (!cuartos.length) {
        return res.status(404).json({ mensaje: "Cuartos no encontrados" });
      }
      res.status(200).json(cuartos);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
