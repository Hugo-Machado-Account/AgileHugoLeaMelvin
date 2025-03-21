const Floor = require("../models/Floor");
const Reservation = require("../models/Reservation");

// @desc    Récupérer tous les étages
// @route   GET /api/floors
// @access  Public
const getFloors = async (req, res) => {
  try {
    const floors = await Floor.find({});
    res.json(floors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Récupérer un étage spécifique
// @route   GET /api/floors/:floorNumber
// @access  Public
const getFloorByNumber = async (req, res) => {
  try {
    const floor = await Floor.findOne({ floorNumber: req.params.floorNumber });

    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    res.json(floor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour un étage
// @route   PUT /api/floors/:floorNumber
// @access  Private (Admin)
const updateFloor = async (req, res) => {
  try {
    const { elements } = req.body;

    const floor = await Floor.findOneAndUpdate(
      { floorNumber: req.params.floorNumber },
      { elements },
      { new: true, upsert: true }
    );

    res.json(floor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Récupérer les salles d'un étage avec leur statut de réservation
// @route   GET /api/floors/:floorNumber/rooms
// @access  Public
const getRoomsByFloor = async (req, res) => {
  try {
    const floor = await Floor.findOne({ floorNumber: req.params.floorNumber });

    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    // Récupérer les réservations du jour pour cet étage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservations = await Reservation.find({
      floorNumber: req.params.floorNumber,
      date: { $gte: today },
    });

    // Mettre à jour le statut des salles en fonction des réservations
    const roomsWithStatus = floor.elements.map((element) => {
      if (element.type === "room") {
        const hasReservation = reservations.some((reservation) => {
          const reservationDate = new Date(reservation.date);
          reservationDate.setHours(0, 0, 0, 0);

          // Vérifier si la réservation concerne cette salle et est pour aujourd'hui
          return (
            reservation.roomId === element.id &&
            reservationDate.getTime() === today.getTime()
          );
        });

        return {
          ...element.toObject(),
          status: hasReservation ? "reserved" : "available",
        };
      }
      return element;
    });

    res.json(roomsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ajouter un élément à un étage
// @route   POST /api/floors/:floorNumber/elements
// @access  Private (Admin)
const addElementToFloor = async (req, res) => {
  try {
    const floor = await Floor.findOne({ floorNumber: req.params.floorNumber });

    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    const newElement = {
      ...req.body,
      id: req.body.id || `elem-${Date.now()}`,
    };

    floor.elements.push(newElement);
    await floor.save();

    res.status(201).json(newElement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour un élément
// @route   PUT /api/floors/:floorNumber/elements/:elementId
// @access  Private (Admin)
const updateElement = async (req, res) => {
  try {
    const floor = await Floor.findOne({ floorNumber: req.params.floorNumber });

    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    const elementIndex = floor.elements.findIndex(
      (el) => el.id === req.params.elementId
    );

    if (elementIndex === -1) {
      return res.status(404).json({ message: "Élément non trouvé" });
    }

    floor.elements[elementIndex] = {
      ...req.body,
      id: req.params.elementId,
    };

    await floor.save();

    res.json(floor.elements[elementIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un élément
// @route   DELETE /api/floors/:floorNumber/elements/:elementId
// @access  Private (Admin)
const deleteElement = async (req, res) => {
  try {
    const floor = await Floor.findOne({ floorNumber: req.params.floorNumber });

    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    const elementIndex = floor.elements.findIndex(
      (el) => el.id === req.params.elementId
    );

    if (elementIndex === -1) {
      return res.status(404).json({ message: "Élément non trouvé" });
    }

    floor.elements.splice(elementIndex, 1);
    await floor.save();

    res.json({ message: "Élément supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFloors,
  getFloorByNumber,
  updateFloor,
  getRoomsByFloor,
  addElementToFloor,
  updateElement,
  deleteElement,
};
