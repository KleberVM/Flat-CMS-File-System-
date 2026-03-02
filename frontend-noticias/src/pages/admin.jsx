import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  // Protección simple: si no hay sesión, manda al login
  useEffect(() => {
    const esAdmin = localStorage.getItem("isAdmin");
    if (!esAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <div className="admin-bienvenida">
      <h2>Bienvenido, Administrador 👋</h2>
      <p>Aquí irá el panel de control en la siguiente etapa.</p>
      <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Admin;
