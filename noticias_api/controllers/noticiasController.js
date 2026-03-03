const { readData, writeData } = require("../utils/manejo");
const { Readable } = require("stream");
const cloudinary = require("../utils/cloudinaryConfig");

const subirACloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "noticias" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
};

exports.getAllNoticias = async (req, res) => {
  try {
    const noticias = await readData();
    res.json(noticias);
  } catch (error) {
    console.error("Error en getAllNoticias:", error);
    res.status(500).json({ message: "Error al leer los datos" });
  }
};

exports.createNoticia = async (req, res) => {
  try {
    const { titulo, resumen, contenido } = req.body;
    const noticias = await readData();

    let imagenUrl = null;
    let imagenPublicId = null;

    if (req.file) {
      const resultado = await subirACloudinary(req.file.buffer);
      imagenUrl = resultado.secure_url;
      imagenPublicId = resultado.public_id;
    }

    const nuevaNoticia = {
      id: Date.now().toString(),
      titulo,
      resumen,
      contenido,
      imagenUrl,
      imagenPublicId,
      fecha: new Date().toLocaleDateString(),
    };

    noticias.push(nuevaNoticia);
    await writeData(noticias);
    res.status(201).json(nuevaNoticia);
  } catch (error) {
    console.error("Error en createNoticia:", error);
    res
      .status(500)
      .json({ message: "Error al crear la noticia", detalle: error.message });
  }
};

exports.updateNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, resumen, contenido } = req.body;
    let noticias = await readData();

    const index = noticias.findIndex((n) => n.id === id);
    if (index === -1)
      return res.status(404).json({ message: "Noticia no encontrada" });

    if (req.file) {
      if (noticias[index].imagenPublicId) {
        try {
          await cloudinary.uploader.destroy(noticias[index].imagenPublicId);
        } catch (err) {
          console.log(
            "No se pudo borrar la imagen anterior de Cloudinary:",
            err.message,
          );
        }
      }

      const resultado = await subirACloudinary(req.file.buffer);
      noticias[index].imagenUrl = resultado.secure_url;
      noticias[index].imagenPublicId = resultado.public_id;
    }

    noticias[index] = {
      ...noticias[index],
      titulo: titulo || noticias[index].titulo,
      resumen: resumen || noticias[index].resumen,
      contenido: contenido || noticias[index].contenido,
      ultimaEdicion: new Date().toLocaleDateString(),
    };

    await writeData(noticias);
    res.json(noticias[index]);
  } catch (error) {
    console.error("Error en updateNoticia:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar", detalle: error.message });
  }
};

exports.deleteNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    let noticias = await readData();

    const noticiaABorrar = noticias.find((n) => n.id === id);
    if (!noticiaABorrar)
      return res.status(404).json({ message: "Noticia no encontrada" });

    if (noticiaABorrar.imagenPublicId) {
      try {
        await cloudinary.uploader.destroy(noticiaABorrar.imagenPublicId);
      } catch (err) {
        console.log("No se pudo borrar la imagen de Cloudinary:", err.message);
      }
    }

    const noticiasFiltradas = noticias.filter((n) => n.id !== id);
    await writeData(noticiasFiltradas);

    res.json({ message: "Noticia e imagen eliminadas correctamente" });
  } catch (error) {
    console.error("Error en deleteNoticia:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar", detalle: error.message });
  }
};
