const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");

// Routes publiques
router.post("/register", registerUser);
router.post("/login", loginUser);

// Routes protégées
router.get("/profile", auth, getUserProfile);

module.exports = router;
