import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axiosConfig';

function Admin() {
    const navigate = useNavigate();
    const [noticias, setNoticias] = useState([]);
    
    const [nuevaNoticia, setNuevaNoticia] = useState({
        titulo: '',
        resumen: '',
        contenido: ''
    });
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        const auth = localStorage.getItem('isAdmin');
        if (!auth) {
            navigate('/login');
        }

        const traerNoticias = async () => {
            try {
                const res = await clienteAxios.get('/noticias');
                setNoticias(res.data);
            } catch (error) {
                console.error("Error al cargar noticias", error);
            }
        };
        traerNoticias();
    }, [navigate]);

    const handleCrear = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('titulo', nuevaNoticia.titulo);
        formData.append('resumen', nuevaNoticia.resumen);
        formData.append('contenido', nuevaNoticia.contenido);
        formData.append('imagen', imagen); // El archivo físico

        try {
            await clienteAxios.post('/noticias', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Noticia creada con éxito");
            window.location.reload();
        } catch (error) {
            alert("Error al crear noticia");
        }
    };

    const handleBorrar = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar esta noticia?")) {
            try {
                await clienteAxios.delete(`/noticias/${id}`);
                setNoticias(noticias.filter(n => n.id !== id)); 
            } catch (error) {
                alert("Error al borrar");
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Panel de Administración</h2>
            <button onClick={() => { localStorage.removeItem('isAdmin'); navigate('/'); }}>
                Cerrar Sesión
            </button>

            <hr />

            <section style={{ background: '#f4f4f4', padding: '15px', marginBottom: '20px' }}>
                <h3>Publicar Nueva Noticia</h3>
                <form onSubmit={handleCrear}>
                    <input type="text" placeholder="Título" required 
                        onChange={(e) => setNuevaNoticia({...nuevaNoticia, titulo: e.target.value})} />
                    <br /><br />
                    <textarea placeholder="Resumen" required
                        onChange={(e) => setNuevaNoticia({...nuevaNoticia, resumen: e.target.value})} />
                    <br /><br />
                    <input type="file" accept="image/*" required
                        onChange={(e) => setImagen(e.target.files[0])} />
                    <br /><br />
                    <button type="submit" style={{ background: 'green', color: 'white' }}>Publicar</button>
                </form>
            </section>

            <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
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
                                <button style={{ color: 'red' }} onClick={() => handleBorrar(n.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;