const { readData, writeData } = require('../utils/manejo');
const fs = require('fs/promises');
const path = require('path');

exports.getAllNoticias = async (req, res) => {
    try {
        const noticias = await readData();
        res.json(noticias);
    } catch (error) {
        res.status(500).json({ message: "Error al leer los datos" });
    }
};

exports.createNoticia = async (req, res) => {
    try {
        const { titulo, resumen, contenido } = req.body;
        const noticias = await readData();

        const nuevaNoticia = {
            id: Date.now().toString(),
            titulo, 
            resumen, 
            contenido,
            imagenUrl: req.file ? `/uploads/${req.file.filename}` : null,
            fecha: new Date().toLocaleDateString()
        };

        noticias.push(nuevaNoticia);
        await writeData(noticias);
        res.status(201).json(nuevaNoticia);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la noticia" });
    }
};

exports.updateNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, resumen, contenido } = req.body;
        let noticias = await readData();
        
        const index = noticias.findIndex(n => n.id === id);
        if (index === -1) return res.status(404).json({ message: "Noticia no encontrada" });

        if (req.file) {
            const antiguaImagenPath = path.join(__dirname, '..', noticias[index].imagenUrl);
            try {
                await fs.unlink(antiguaImagenPath);
            } catch (err) {
                console.log("No se pudo borrar la imagen anterior o no existía");
            }
            noticias[index].imagenUrl = `/uploads/${req.file.filename}`;
        }

        noticias[index] = {
            ...noticias[index],
            titulo: titulo || noticias[index].titulo,
            resumen: resumen || noticias[index].resumen,
            contenido: contenido || noticias[index].contenido,
            ultimaEdicion: new Date().toLocaleDateString()
        };

        await writeData(noticias);
        res.json(noticias[index]);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
    }
};

exports.deleteNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        let noticias = await readData();

        const noticiaABorrar = noticias.find(n => n.id === id);
        if (!noticiaABorrar) return res.status(404).json({ message: "Noticia no encontrada" });

        const imagenPath = path.join(__dirname, '..', noticiaABorrar.imagenUrl);
        try {
            await fs.unlink(imagenPath);
        } catch (err) {
            console.log("La imagen no existia en la carpeta uploads");
        }

        const noticiasFiltradas = noticias.filter(n => n.id !== id);
        await writeData(noticiasFiltradas);

        res.json({ message: "Noticia e imagen eliminadas correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
};