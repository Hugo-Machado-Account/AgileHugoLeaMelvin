const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservations,
  getMyReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationController");
const { auth, admin, teacherOrAdmin } = require("../middleware/auth");

// Routes protégées
router.post("/", auth, createReservation);
router.get("/my", auth, getMyReservations);
router.get("/:id", auth, getReservationById);
router.put("/:id", auth, updateReservation);
router.delete("/:id", auth, deleteReservation);

// Routes admin
router.get("/", auth, teacherOrAdmin, getReservations);

module.exports = router;
