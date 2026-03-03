import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import clienteAxios from "../api/axiosConfig";

function Login() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin")) {
      navigate("/admin");
    }
  }, [navigate]);

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await clienteAxios.post("/auth/login", { password });

      if (respuesta.data.auth) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
      } else {
        alert("Contraseña incorrecta. Intenta de nuevo.");
      }
    } catch (error) {
      if (error.response) {
        alert("Contraseña incorrecta.");
      } else {
        alert(
          "No se pudo conectar con el servidor.\n" +
            "Verifica que el backend esté corriendo.\n\n" +
            "URL usada: " +
            clienteAxios.defaults.baseURL,
        );
      }
      console.error("Error en login:", error.response?.data || error.message);
    }
  };

  return (
    <div className="login-caja">
      <h2>Acceso Administrador</h2>

      <form onSubmit={manejarLogin}>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>

      <Link to="/" className="btn-volver-inicio">
        ← Volver al inicio
      </Link>
    </div>
  );
}

export default Login;
