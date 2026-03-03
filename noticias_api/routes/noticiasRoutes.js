const express = require("express");
const router = express.Router();
const noticiasController = require("../controllers/noticiasController");
const multer = require("multer");

// Usamos memoryStorage en vez de diskStorage.
// Esto guarda la imagen en RAM (req.file.buffer) en vez de escribirla al disco.
// Luego el controlador la sube a Cloudinary desde ese buffer.
// Así no dependemos del sistema de archivos de Render (que es efímero).
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", noticiasController.getAllNoticias);

router.post("/", upload.single("imagen"), noticiasController.createNoticia);

router.put("/:id", upload.single("imagen"), noticiasController.updateNoticia);

router.delete("/:id", noticiasController.deleteNoticia);

module.exports = router;
