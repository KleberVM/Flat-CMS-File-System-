import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login.jsx'; // Lo crearemos ahora
import Admin from './pages/admin'; // El panel de control

function App() {
  return (
    <Router>
      <div className="container">
        <nav>
          <h1>Sistema de Noticias</h1>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/login">Admin</a></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;