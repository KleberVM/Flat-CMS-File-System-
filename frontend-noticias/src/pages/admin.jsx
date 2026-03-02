import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axiosConfig';

function Admin() {
    const navigate = useNavigate();
    const [noticias, setNoticias] = useState([]);

    useEffect(() => {
        const auth = localStorage.getItem('isAdmin');
        if (!auth) {
            navigate('/login');
        }

        const traerNoticias = async () => {
            const res = await clienteAxios.get('/noticias');
            setNoticias(res.data);
        };
        traerNoticias();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    return (
        <div>
            <h2>Panel de Administración</h2>
            <button onClick={cerrarSesion}>Cerrar Sesión</button>
            <hr />
            <button style={{ background: 'green', color: 'white' }}>+ Nueva Noticia</button>
            
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {noticias.map(n => (
                        <tr key={n.id}>
                            <td>{n.titulo}</td>
                            <td>{n.fecha}</td>
                            <td>
                                <button>Editar</button>
                                <button style={{ color: 'red' }}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;