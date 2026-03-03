import axios from "axios";

const clienteAxios = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://flat-cms-ar1z.onrender.com/api",
});

export default clienteAxios;
