require('dotenv').config();
const express = require('express');
const cors = require('cors');
const noticiasRoutes = require('./routes/noticiasRoutes');
const healthcheckRoutes = require('./routes/healthcheckRoutes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/noticias', noticiasRoutes);
app.use('/api/healthcheck', healthcheckRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));