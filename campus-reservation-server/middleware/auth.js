const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Vérifier si le token existe dans l'en-tête
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trouver l'utilisateur correspondant
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

// Middleware pour vérifier si l'utilisateur est un administrateur
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Accès non autorisé. Rôle administrateur requis." });
  }
};

// Middleware pour vérifier si l'utilisateur est un professeur ou un administrateur
const teacherOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "teacher" || req.user.role === "admin")) {
    next();
  } else {
    res
      .status(403)
      .json({
        message:
          "Accès non autorisé. Rôle professeur ou administrateur requis.",
      });
  }
};

module.exports = { auth, admin, teacherOrAdmin };
