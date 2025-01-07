//put actualizar
//post crear , realizar login
//get
//delete
const router = require("express").Router();
const AppError = require("../error/AppError")

const {
  createBeca,
  deleteBeca,
  getBeca,
  updateBeca,
} = require("../controller/becaController");

/**
 * @swagger
 * /becas:
 *   get:
 *     summary: Obtiene una lista de becas
 *     tags:
 *       - Beca
 *     responses:
 *       200:
 *         description: Lista de becas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre_beca:
 *                     type: string
 *       500:
 *         description: Error de servidor
 */
router.get("/becas", async (req, res, next) => {
  try {
    const becas = await getBeca();
    res.status(200).json(becas);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /becas/create:
 *   post:
 *     summary: Crea una nueva beca
 *     tags:
 *       - Beca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_beca:
 *                 type: string
 *               jefe_beca:
 *                 type: string
 *     responses:
 *       201:
 *         description: Beca creada
 *       400:
 *         description: Todos los campos son requeridos
 *       500:
 *         description: Error de servidor
 */
router.post("/becas/create", async (req, res, next) => {
  try {
    const { nombre_beca, jefe_beca } = req.body;

    if (!nombre_beca || !jefe_beca) {
      throw new AppError("Todos los campos son reuqeridos", 400);
    }
    const beca = await createBeca(nombre_beca, jefe_beca);
    res.status(201).json(beca);
  } catch (error) {
    next(error); //Error de servidor 500
  }
});

/**
 * @swagger
 * /becas/update/{id}:
 *   put:
 *     summary: Actualiza una beca existente
 *     tags:
 *       - Beca
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la beca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_beca:
 *                 type: string
 *               jefe_beca:
 *                 type: string
 *     responses:
 *       200:
 *         description: Beca actualizada
 *       400:
 *         description: El id es requerido o todos los campos son requeridos
 *       404:
 *         description: Beca no encontrada
 *       500:
 *         description: Error de servidor
 */
router.put("/becas/update/:id", async (req, res, next) => {
  //:id es para rcibir parametros
  try {
    const { nombre_beca, jefe_beca } = req.body;
    const { id } = req.params;

    if (!id) {
      throw new AppError("El id es requerido", 400);
    }

    if (!nombre_beca || !jefe_beca) {
      throw new AppError("Todos los campos son requeridos", 400);
    }
    const beca = await updateBeca(id, nombre_beca, jefe_beca);
    if (beca == 0) {
      throw new AppError("Usuario no encontrado", 404);
    }

    res.status(200).json({ mensaje: "Usuario actualizado " });
  } catch (error) {
    next(error); //Error de servidor 500
  }
});

/**
 * @swagger
 * /becas/delete/{id}:
 *   delete:
 *     summary: Elimina una beca
 *     tags:
 *       - Beca
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la beca
 *     responses:
 *       200:
 *         description: Beca eliminada
 *       400:
 *         description: El id es requerido
 *       404:
 *         description: Beca no encontrada
 *       500:
 *         description: Error de servidor
 */
router.delete("/becas/delete/:id", async (req, res, next) => {
  //:id es para rcibir parametros
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError("El id es requerido", 400);
    }

    const beca = await deleteBeca(id);
    if (beca == 0) {
      throw new AppError("El id es requerido", 400);
    }

    res.status(200).json({ mensaje: "Beca eliminado " });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
