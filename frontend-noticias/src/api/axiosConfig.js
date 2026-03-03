import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'https://flat-cms-ar1z.onrender.com/api' 
});

export default clienteAxios;