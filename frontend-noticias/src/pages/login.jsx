import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../api/axiosConfig";

function Login() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await clienteAxios.post("/auth/login", { password });
      if (respuesta.data.auth) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
      }
    } catch (error) {
      alert("Contraseña incorrecta");
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
    </div>
  );
}

export default Login;
