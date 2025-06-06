const Floor = require("../models/Floor");
const Reservation = require("../models/Reservation");

// @desc    Créer un nouvel étage
// @route   POST /api/floors
// @access  Private/Admin
const createFloor = async (req, res) => {
  try {
    const { floorNumber, name, elements } = req.body;

    // Vérifier si l'étage existe déjà
    const existingFloor = await Floor.findByFloorNumber(floorNumber);
    if (existingFloor) {
      return res.status(400).json({ message: "Cet étage existe déjà" });
    }

    const floor = await Floor.create({
      floorNumber,
      name,
      elements
    });

    res.status(201).json(floor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir tous les étages
// @route   GET /api/floors
// @access  Public
const getFloors = async (req, res) => {
  try {
    const floors = await Floor.findAll();
    res.json(floors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir un étage par numéro
// @route   GET /api/floors/:floorNumber
// @access  Public
const getFloorByNumber = async (req, res) => {
  try {
    const floor = await Floor.findByFloorNumber(parseInt(req.params.floorNumber));
    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }
    res.json(floor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour un étage
// @route   PUT /api/floors/:id
// @access  Private/Admin
const updateFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);
    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    const updatedFloor = await Floor.update(req.params.id, req.body);
    res.json(updatedFloor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un étage
// @route   DELETE /api/floors/:id
// @access  Private/Admin
const deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);
    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    await Floor.delete(req.params.id);
    res.json({ message: "Étage supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir toutes les salles
// @route   GET /api/floors/rooms
// @access  Public
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Floor.getAllRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Récupérer les salles d'un étage avec leur statut de réservation
// @route   GET /api/floors/:floorNumber/rooms
// @access  Public
const getRoomsByFloor = async (req, res) => {
  try {
    const floor = await Floor.findByFloorNumber(parseInt(req.params.floorNumber));

    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    // Récupérer les réservations du jour pour cet étage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Firestore: on utilise findByField et on filtre ensuite par date
    const reservations = await Reservation.findByField('floorNumber', parseInt(req.params.floorNumber));
    const filteredReservations = (reservations || []).filter(r => {
      const date = new Date(r.date);
      return date >= today;
    });

    // Mettre à jour le statut des salles en fonction des réservations
    const roomsWithStatus = (floor.elements || []).map((element) => {
      if (element.type === "room") {
        const hasReservation = filteredReservations.some((reservation) => {
          const reservationDate = new Date(reservation.date);
          reservationDate.setHours(0, 0, 0, 0);

          // Vérifier si la réservation concerne cette salle et est pour aujourd'hui
          return (
            reservation.roomId === element.id &&
            reservationDate.getTime() === today.getTime()
          );
        });

        return {
          ...(typeof element.toObject === 'function' ? element.toObject() : element),
          status: hasReservation ? "reserved" : "available",
        };
      }
      return element;
    });

    res.json(roomsWithStatus);
  } catch (error) {
    console.error('Erreur dans getRoomsByFloor:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ajouter un élément à un étage
// @route   POST /api/floors/:floorNumber/elements
// @access  Private (Admin)
const addElementToFloor = async (req, res) => {
  try {
    const floor = await Floor.findByFloorNumber(parseInt(req.params.floorNumber));

    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    const newElement = {
      ...req.body,
      id: req.body.id || `elem-${Date.now()}`,
    };

    floor.elements = floor.elements || [];
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
    const floor = await Floor.findByFloorNumber(parseInt(req.params.floorNumber));

    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    const elementIndex = (floor.elements || []).findIndex(
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
    const floor = await Floor.findByFloorNumber(parseInt(req.params.floorNumber));

    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    const elementIndex = (floor.elements || []).findIndex(
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
  createFloor,
  getFloors,
  getFloorByNumber,
  updateFloor,
  deleteFloor,
  getAllRooms,
  getRoomsByFloor,
  addElementToFloor,
  updateElement,
  deleteElement,
};
