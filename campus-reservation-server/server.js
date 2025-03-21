const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const floorRoutes = require("./routes/floorRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/floors", floorRoutes);
app.use("/api/reservations", reservationRoutes);

// Route racine
app.get("/", (req, res) => {
  res.json({ message: "API de réservation de salles" });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
