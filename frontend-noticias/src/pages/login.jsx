import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axiosConfig';

function Login() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await clienteAxios.post('/auth/login', { password });
            if (respuesta.data.auth) {
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin');
            }
        } catch (error) {
            alert("Contraseña incorrecta");
        }
    };

    return (
        <div style={{ maxWidth: '300px', margin: '50px auto' }}>
            <h2>Acceso Administrador</h2>
            <form onSubmit={manejarLogin}>
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                />
                <button type="submit" style={{ width: '100%' }}>Entrar</button>
            </form>
        </div>
    );
}

export default Login;