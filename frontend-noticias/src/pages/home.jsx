import { useEffect, useState } from "react";
import clienteAxios from "../api/axiosConfig";

function Home() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    const obtenerNoticias = async () => {
      try {
        const respuesta = await clienteAxios.get("/noticias");
        setNoticias(respuesta.data);
      } catch (error) {
        console.error("Error al traer noticias", error);
      }
    };
    obtenerNoticias();
  }, []);

  return (
    <div>
      <h2>Últimas Noticias</h2>
      <div className="grid-noticias">
        {noticias.length === 0 ? (
          <p>No hay noticias por ahora.</p>
        ) : (
          noticias.map((noticia) => (
            <article key={noticia.id}>
              {noticia.imagenUrl && (
                <img src={noticia.imagenUrl} alt={noticia.titulo} />
              )}
              <h3>{noticia.titulo}</h3>
              <p>{noticia.resumen}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
