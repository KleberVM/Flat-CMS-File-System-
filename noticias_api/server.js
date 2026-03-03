require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "uploads");
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "noticias.json");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Carpeta uploads/ creada automáticamente");
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("Carpeta data/ creada automáticamente");
}

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]");
  console.log("Archivo noticias.json creado automáticamente");
}

const noticiasRoutes = require("./routes/noticiasRoutes");
const healthcheckRoutes = require("./routes/healthcheckRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rutas
app.use("/api/noticias", noticiasRoutes);
app.use("/api/healthcheck", healthcheckRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
