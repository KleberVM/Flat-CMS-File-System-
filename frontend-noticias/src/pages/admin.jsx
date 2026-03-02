import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../api/axiosConfig";

function Admin() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    titulo: "",
    resumen: "",
    contenido: "",
  });

  const [imagen, setImagen] = useState(null);

  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const esAdmin = localStorage.getItem("isAdmin");
    if (!esAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const manejarImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const datos = new FormData();
    datos.append("titulo", formulario.titulo);
    datos.append("resumen", formulario.resumen);
    datos.append("contenido", formulario.contenido);
    datos.append("imagen", imagen);

    setEnviando(true);

    try {
      await clienteAxios.post("/noticias", datos, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("¡Noticia publicada con éxito!");

      setFormulario({ titulo: "", resumen: "", contenido: "" });

      setImagen(null);
      e.target.reset();
    } catch (error) {
      alert(
        "Error al publicar la noticia. Revisa que todos los campos estén completos.",
      );
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Panel de Administración</h2>
        <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
          Cerrar Sesión
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <section className="admin-formulario">
        <h3>Publicar Nueva Noticia</h3>

        <form onSubmit={manejarEnvio}>
          <div className="campo">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ej: Bloqueo de carreteras a nivel nacional Bolivia"
              value={formulario.titulo}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="campo">
            <label>Resumen</label>
            <textarea
              name="resumen"
              placeholder="Un párrafo corto que describe la noticia..."
              value={formulario.resumen}
              onChange={manejarCambio}
              required
              rows={3}
            />
          </div>

          <div className="campo">
            <label>Contenido completo</label>
            <textarea
              name="contenido"
              placeholder="Aqui se escribe el articulo completo"
              value={formulario.contenido}
              onChange={manejarCambio}
              required
              rows={8}
            />
          </div>

          <div className="campo">
            <label>Imagen de portada</label>
            <input
              type="file"
              accept="image/*"
              onChange={manejarImagen}
              required
            />
            {imagen && (
              <small style={{ color: "green" }}>
                Archivo seleccionado: {imagen.name}
              </small>
            )}
          </div>

          <button type="submit" className="btn-publicar" disabled={enviando}>
            {enviando ? "Publicando..." : "Publicar Noticia"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Admin;
