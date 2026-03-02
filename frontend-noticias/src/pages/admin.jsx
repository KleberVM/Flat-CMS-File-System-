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

  const [noticias, setNoticias] = useState([]);

  const [noticiaEditando, setNoticiaEditando] = useState(null);

  useEffect(() => {
    const esAdmin = localStorage.getItem("isAdmin");
    if (!esAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    try {
      const respuesta = await clienteAxios.get("/noticias");
      setNoticias(respuesta.data);
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const manejarImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const manejarEditar = (noticia) => {
    setNoticiaEditando(noticia.id);

    setFormulario({
      titulo: noticia.titulo,
      resumen: noticia.resumen,
      contenido: noticia.contenido,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setNoticiaEditando(null);
    setFormulario({ titulo: "", resumen: "", contenido: "" });
    setImagen(null);
  };

  const manejarEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar esta noticia? Esta acción no se puede deshacer.",
    );
    if (!confirmar) return; // Si el admin cancela, no hacemos nada

    try {
      await clienteAxios.delete(`/noticias/${id}`);

      setNoticias(noticias.filter((n) => n.id !== id));
    } catch (error) {
      alert("Error al eliminar la noticia.");
      console.error(error);
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const datos = new FormData();
    datos.append("titulo", formulario.titulo);
    datos.append("resumen", formulario.resumen);
    datos.append("contenido", formulario.contenido);

    if (imagen) {
      datos.append("imagen", imagen);
    }

    setEnviando(true);

    try {
      if (noticiaEditando) {
        await clienteAxios.put(`/noticias/${noticiaEditando}`, datos, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("¡Noticia actualizada con exito!");

        setNoticiaEditando(null);
      } else {
        await clienteAxios.post("/noticias", datos, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("¡Noticia publicada con exitosamente!");
      }

      setFormulario({ titulo: "", resumen: "", contenido: "" });
      setImagen(null);
      e.target.reset();
      cargarNoticias();
    } catch (error) {
      // Intentamos mostrar el mensaje real del servidor para facilitar el debug.
      // error.response existe cuando el servidor respondió (ej: 500, 404).
      // Si no hay respuesta (ej: servidor apagado), mostramos un mensaje de red.
      const mensajeServidor = error.response?.data?.message;
      const mensajeFinal = mensajeServidor
        ? `Error del servidor: ${mensajeServidor}`
        : "No se pudo conectar con el servidor. ¿Está corriendo el backend?";
      alert(mensajeFinal);
      console.error(
        "Detalle del error:",
        error.response?.data || error.message,
      );
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
        <h3>
          {noticiaEditando ? "Editando Noticia" : "Publicar Nueva Noticia"}
        </h3>

        {noticiaEditando && (
          <div className="banner-edicion">
            Estás modificando una noticia existente.{" "}
            <button className="btn-cancelar" onClick={cancelarEdicion}>
              Cancelar y volver a crear
            </button>
          </div>
        )}

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
              placeholder="Aquí se escribe el artículo completo..."
              value={formulario.contenido}
              onChange={manejarCambio}
              required
              rows={8}
            />
          </div>

          <div className="campo">
            <label>
              Imagen de portada {/* En modo edición avisamos que es opcional */}
              {noticiaEditando && (
                <span style={{ fontWeight: "normal", color: "#888" }}>
                  (opcional: solo si quieres reemplazarla)
                </span>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={manejarImagen}
              required={!noticiaEditando}
            />
            {imagen && (
              <small style={{ color: "green" }}>
                Archivo seleccionado: {imagen.name}
              </small>
            )}
          </div>

          <button type="submit" className="btn-publicar" disabled={enviando}>
            {enviando
              ? "Guardando..."
              : noticiaEditando
                ? "Guardar Cambios"
                : "Publicar Noticia"}
          </button>
        </form>
      </section>

      <hr style={{ margin: "30px 0" }} />

      <section>
        <h3>Noticias Publicadas ({noticias.length})</h3>

        {noticias.length === 0 ? (
          <p style={{ color: "#888", fontStyle: "italic" }}>
            No hay noticias publicadas todavía.
          </p>
        ) : (
          <table className="tabla-noticias">
            <thead>
              <tr>
                <th>Título</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noticias.map((noticia) => (
                <tr
                  key={noticia.id}
                  className={
                    noticiaEditando === noticia.id ? "fila-activa" : ""
                  }
                >
                  <td>{noticia.titulo}</td>
                  <td>{noticia.fecha}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => manejarEditar(noticia)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-eliminar"
                      onClick={() => manejarEliminar(noticia.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Admin;
