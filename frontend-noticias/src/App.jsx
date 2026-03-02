import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Admin from "./pages/admin";

function App() {
  return (
    <Router>
      <div className="container">
        <nav>
          <h1>Sistema de Noticias</h1>
          <Link to="/login" className="nav-link-admin">
            Admin
          </Link>
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
