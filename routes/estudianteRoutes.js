const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const AppError = require("../error/AppError");
const authenticate = require("../middlewares/authenticate");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const uploadDir = "uploads";

// Asegurar que la carpeta existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Modificar la configuración de multer para almacenar en memoria cuando se usa Supabase
const storage = multer.memoryStorage();

// Configuración de Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024, // Limitar tamaño a 500kB
  },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|webp|avif|gif|svg/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new AppError("Solo se permiten archivos de imagen", 400));
    }
  },
});

async function handleFileUpload(file, title) {
  if (process.env.IMAGE_SERVER === "supabase") {
    const uniqueSuffix = Date.now();
    const fileName = `${title.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}-${uniqueSuffix}${path.extname(file.originalname)}`;

    const { data, error } = await supabase.storage
      .from("estudiantes_beca")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw new AppError("Error uploading to Supabase", 500);

    const { data: urlData } = supabase.storage
      .from("estudiantes_beca")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } else {
    // Lógica existente para almacenamiento local
    const uniqueSuffix = Date.now();
    const fileName = `${title.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}-${uniqueSuffix}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);
    return `${fileName}`;
  }
}

async function handleDeleteFile(file) {
  if (process.env.IMAGE_SERVER === "supabase" && file) {
    try {
      await supabase.storage.from("estudiantes_beca").remove([file]);
    } catch (deleteError) {
      console.error("Error al eliminar la imagen de Supabase:", deleteError);
    }
  } else if (process.env.IMAGE_SERVER === "server" && file) {
    const filePath = path.join(uploadDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

const {
  createEstudiante,
  deleteEstudiante,
  getEstudiantes,
  updateEstudiante,
} = require("../controller/estudianteController");

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
router.get(
  "/estudiantes",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const estudiantes = await getEstudiantes();
      res.status(200).json(estudiantes);
    } catch (error) {
      next(error);
    }
  }
);

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
 *               ci:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estudiante creado
 *       400:
 *         description: Todos los campos son requeridos
 *       500:
 *         description: Error de servidor
 */
router.post(
  "/estudiantes/create",
  upload.single("foto"),
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const {
        nombre_estudiante,
        apellido_estudiante,
        anio_academico,
        edad,
        carrera,
        facultad,
        cuartoId,
        ci,
      } = req.body;
      let foto = null;

      if (req.file) {
        foto = await handleFileUpload(req.file, nombre_estudiante);
      }

      if (
        !nombre_estudiante ||
        !apellido_estudiante ||
        !anio_academico ||
        !edad ||
        !carrera ||
        !facultad ||
        !cuartoId ||
        !ci
      ) {
        throw new AppError("Todos los campos son requeridos", 400);
      }

      const estudiante = await createEstudiante(
        nombre_estudiante,
        apellido_estudiante,
        anio_academico,
        edad,
        carrera,
        facultad,
        cuartoId,
        foto,
        ci
      );
      res.status(201).json(estudiante);
    } catch (error) {
      if (error?.parent?.detail.includes("ci")) {
        return next(
          new AppError(
            "Ya existe un estudainte con ese carnet de identidad",
            400
          )
        );
      }
      next(error);
    }
  }
);

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
 *               ci:
 *                 type: string
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
router.put(
  "/estudiantes/update/:id",
  upload.single("foto"),
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const {
        nombre_estudiante,
        apellido_estudiante,
        anio_academico,
        edad,
        carrera,
        facultad,
        cuartoId,
        ci,
      } = req.body;
      const { id } = req.params;
      let foto = null;

      if (req.file) {
        foto = await handleFileUpload(req.file, nombre_estudiante);
      }

      if (!id) {
        throw new AppError("El id es requerido", 400);
      }

      if (
        !nombre_estudiante ||
        !apellido_estudiante ||
        !anio_academico ||
        !edad ||
        !carrera ||
        !facultad ||
        !cuartoId ||
        !ci
      ) {
        throw new AppError("Todos los campos son requeridos", 400);
      }

      const estudiante = await updateEstudiante(
        id,
        nombre_estudiante,
        apellido_estudiante,
        anio_academico,
        edad,
        carrera,
        facultad,
        cuartoId,
        foto,
        ci
      );
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
        foto,
        ci,
      });
    } catch (error) {
      if (error?.parent?.detail.includes("ci")) {
        return next(
          new AppError(
            "Ya existe un estudainte con ese carnet de identidad",
            400
          )
        );
      }
      next(error);
    }
  }
);

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
router.delete(
  "/estudiantes/delete/:id",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("El id es requerido", 400);
      }

      const estudiante = await deleteEstudiante(id);
      if (estudiante == 0) {
        throw new AppError("Estudiante no encontrado", 404);
      }

      // Aquí se asume que tienes una forma de obtener el nombre del archivo a eliminar
      const fileName = estudiante.foto; // Ajusta esto según tu lógica
      if (fileName) {
        await handleDeleteFile(fileName);
      }

      res.status(200).json({ mensaje: "Estudiante eliminado" });
    } catch (error) {
      next(error);
    }
  }
);

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
router.get(
  "/estudiantes/:id",
  authenticate(["administrador", "gestor"]),
  async (req, res, next) => {
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
  }
);

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
