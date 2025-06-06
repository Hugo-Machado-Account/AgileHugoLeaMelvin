const Reservation = require('../models/Reservation');
const Floor = require('../models/Floor');

// @desc    Créer une nouvelle réservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const {
      roomId,
      floorNumber,
      date,
      startTime,
      endTime,
      purpose,
      notes
    } = req.body;

    // Vérifier si la salle existe et est disponible
    const floor = await Floor.findByFloorNumber(floorNumber);
    if (!floor) {
      return res.status(404).json({ message: "Étage non trouvé" });
    }

    const room = floor.elements.find(element => element.id === roomId);
    if (!room) {
      return res.status(404).json({ message: "Salle non trouvée" });
    }

    // Vérifier si la salle est déjà réservée pour cette période
    const existingReservations = await Reservation.findByRoomId(roomId);
    const isOverlapping = existingReservations.some(reservation => {
      if (reservation.date.toDateString() !== new Date(date).toDateString()) {
        return false;
      }
      return (
        (startTime >= reservation.startTime && startTime < reservation.endTime) ||
        (endTime > reservation.startTime && endTime <= reservation.endTime) ||
        (startTime <= reservation.startTime && endTime >= reservation.endTime)
      );
    });

    if (isOverlapping) {
      return res.status(400).json({ message: "La salle est déjà réservée pour cette période" });
    }

    // Créer la réservation
    const reservation = await Reservation.create({
      roomId,
      floorNumber,
      userId: req.user.id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      date: new Date(date),
      startTime,
      endTime,
      purpose,
      notes,
      status: 'confirmed'
    });

    // Mettre à jour le statut de la salle
    await Floor.updateRoomStatus(floor.id, roomId, 'reserved');

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir toutes les réservations (admin/teacher)
// @route   GET /api/reservations
// @access  Private/Admin
const getReservations = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let reservations;

    if (status) {
      reservations = await Reservation.findByStatus(status);
    } else if (startDate && endDate) {
      reservations = await Reservation.findByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      reservations = await Reservation.findAll();
    }

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir les réservations de l'utilisateur connecté
// @route   GET /api/reservations/my
// @access  Private
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findByUserId(req.user.id);
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir une réservation par ID
// @route   GET /api/reservations/:id
// @access  Private
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier si l'utilisateur est autorisé à voir cette réservation
    if (
      reservation.userId !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'teacher'
    ) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour une réservation
// @route   PUT /api/reservations/:id
// @access  Private
const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier si l'utilisateur est autorisé à modifier cette réservation
    if (
      reservation.userId !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'teacher'
    ) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    const updatedReservation = await Reservation.update(req.params.id, req.body);
    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer une réservation
// @route   DELETE /api/reservations/:id
// @access  Private
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier si l'utilisateur est autorisé à supprimer cette réservation
    if (
      reservation.userId !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'teacher'
    ) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Mettre à jour le statut de la salle
    const floor = await Floor.findByFloorNumber(reservation.floorNumber);
    if (floor) {
      await Floor.updateRoomStatus(floor.id, reservation.roomId, 'available');
    }

    await Reservation.delete(req.params.id);
    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getReservations,
  getMyReservations,
  getReservationById,
  updateReservation,
  deleteReservation
};
