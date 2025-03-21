const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// @desc    Inscrire un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role, department } =
      req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || "student",
      department,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Données utilisateur invalides" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authentifier un utilisateur et obtenir un token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // Vérifier si le mot de passe est correct
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // Mettre à jour la date de dernière connexion
    user.lastLogin = Date.now();
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
