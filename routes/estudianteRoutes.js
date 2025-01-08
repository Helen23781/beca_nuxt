const router = require("express").Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const upload = multer({ storage: storage });
const path = require("path");

const {
  createEstudiante,
  deleteEstudiante,
  getEstudiantes,
  updateEstudiante,
} = require("../controller/estudianteController");
const AppError = require("../error/AppError");

/**
 * @swagger
 * /estudiantes:
 *   get:
 *     summary: Obtiene una lista de estudiantes
 *     tags:
 *       - Estudiante
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error de servidor
 */
router.get("/estudiantes", async (req, res, next) => {
  try {
    const estudiantes = await getEstudiantes();
    res.status(200).json(estudiantes);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /estudiantes/create:
 *   post:
 *     summary: Crea un nuevo estudiante
 *     tags:
 *       - Estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_estudiante:
 *                 type: string
 *               apellido_estudiante:
 *                 type: string
 *               anio_academico:
 *                 type: string
 *               edad:
 *                 type: string
 *               carrera:
 *                 type: string
 *               facultad:
 *                 type: string
 *               cuartoId:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Estudiante creado
 *       400:
 *         description: Todos los campos son requeridos
 *       500:
 *         description: Error de servidor
 */
router.post("/estudiantes/create", upload.single("foto"), async (req, res, next) => {
  try {
    const { nombre_estudiante, apellido_estudiante, anio_academico, edad, carrera, facultad, cuartoId } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!nombre_estudiante || !apellido_estudiante || !anio_academico || !edad || !carrera || !facultad || !cuartoId) {
      throw new AppError("Todos los campos son requeridos", 400); 
    }

    const estudiante = await createEstudiante(nombre_estudiante, apellido_estudiante, anio_academico, edad, carrera, facultad, cuartoId, foto);
    res.status(201).json(estudiante);
  } catch (error) {
    next(error);
  }
  
});

/**
 * @swagger
 * /estudiantes/update/{id}:
 *   put:
 *     summary: Actualiza un estudiante existente
 *     tags:
 *       - Estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_estudiante:
 *                 type: string
 *               apellido_estudiante:
 *                 type: string
 *               anio_academico:
 *                 type: string
 *               edad:
 *                 type: string
 *               carrera:
 *                 type: string
 *               facultad:
 *                 type: string
 *               cuartoId:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Estudiante actualizado
 *       400:
 *         description: El id es requerido o todos los campos son requeridos
 *       404:
 *         description: Estudiante no encontrado
 *       500:
 *         description: Error de servidor
 */
router.put("/estudiantes/update/:id", upload.single("foto"), async (req, res, next) => {
  try {
    const { nombre_estudiante, apellido_estudiante, anio_academico, edad, carrera, facultad, cuartoId } = req.body;
    const { id } = req.params;
    const foto = req.file ? req.file.filename : null;

    if (!id) {
      throw new AppError("El id es requerido", 400);
    }

    if (!nombre_estudiante || !apellido_estudiante || !anio_academico || !edad || !carrera || !facultad || !cuartoId) {
      throw new AppError("Todos los campos son requeridos", 400);
    }

    const estudiante = await updateEstudiante(id, nombre_estudiante, apellido_estudiante, anio_academico, edad, carrera, facultad, cuartoId, foto);
    if (estudiante == 0) {
      throw new AppError("Estudiante no encontrado", 404);
    }

    res.status(200).json({
      mensaje: "Estudiante actualizado",
      id: id,
      nombre_estudiante,
      apellido_estudiante,
      anio_academico,
      edad,
      carrera,
      facultad,
      cuartoId,
      foto
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /estudiantes/delete/{id}:
 *   delete:
 *     summary: Elimina un estudiante
 *     tags:
 *       - Estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Estudiante eliminado
 *       400:
 *         description: El id es requerido
 *       404:
 *         description: Estudiante no encontrado
 *       500:
 *         description: Error de servidor
 */
router.delete("/estudiantes/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError("El id es requerido", 400);
    }

    const estudiante = await deleteEstudiante(id);
    if (estudiante == 0) {
      throw new AppError("Estudiante no encontrado", 404);
    }

    res.status(200).json({ mensaje: "Estudiante eliminado" });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /estudiantes/{id}:
 *   get:
 *     summary: Muestra un estudiante específico
 *     tags:
 *       - Estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Detalles del estudiante
 *       404:
 *         description: Estudiante no encontrado
 *       500:
 *         description: Error de servidor
 */
router.get("/estudiantes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const estudiante = await getEstudianteById(id);
    if (!estudiante) {
      throw new AppError("Estudiante no encontrado", 404);
    }
    res.status(200).json(estudiante);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /estudiantes/foto/{filename}:
 *   get:
 *     summary: Obtiene la foto de un estudiante
 *     tags:
 *       - Estudiante
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del archivo de la foto
 *     responses:
 *       200:
 *         description: Foto del estudiante
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Foto no encontrada
 *       500:
 *         description: Error de servidor
 */
router.get("/estudiantes/foto/:filename", (req, res, next) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads", filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      next(new AppError("Foto no encontrada", 404));
    }
  });
});

module.exports = router; 