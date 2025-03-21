const express = require("express");
const router = express.Router();
const {
  getFloors,
  getFloorByNumber,
  updateFloor,
  getRoomsByFloor,
  addElementToFloor,
  updateElement,
  deleteElement,
} = require("../controllers/floorController");
const { auth, admin } = require("../middleware/auth");

// Routes publiques
router.get("/", getFloors);
router.get("/:floorNumber", getFloorByNumber);
router.get("/:floorNumber/rooms", getRoomsByFloor);

// Routes protégées (Admin)
router.put("/:floorNumber", auth, admin, updateFloor);
router.post("/:floorNumber/elements", auth, admin, addElementToFloor);
router.put("/:floorNumber/elements/:elementId", auth, admin, updateElement);
router.delete("/:floorNumber/elements/:elementId", auth, admin, deleteElement);

module.exports = router;
