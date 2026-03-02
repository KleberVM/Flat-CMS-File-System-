const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticiasController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', noticiasController.getAllNoticias);

router.post('/', upload.single('imagen'), noticiasController.createNoticia);

router.put('/:id', upload.single('imagen'), noticiasController.updateNoticia);

router.delete('/:id', noticiasController.deleteNoticia);

module.exports = router;