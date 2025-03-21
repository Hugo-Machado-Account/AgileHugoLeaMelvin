const Reservation = require("../models/Reservation");
const Floor = require("../models/Floor");

// @desc    Créer une nouvelle réservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const {
      roomId,
      floorNumber,
      name,
      email,
      date,
      startTime,
      endTime,
      purpose,
      notes,
    } = req.body;

    // Vérifier si la salle existe
    const floor = await Floor.findOne({
      floorNumber,
      "elements.id": roomId,
      "elements.type": "room",
    });

    if (!floor) {
      return res.status(404).json({ message: "Salle non trouvée" });
    }

    // Vérifier si la salle est déjà réservée à cette date et ces heures
    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0);

    const existingReservation = await Reservation.findOne({
      roomId,
      date: reservationDate,
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gt: startTime },
        },
        {
          startTime: { $lt: endTime },
          endTime: { $gte: endTime },
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime },
        },
      ],
    });

    if (existingReservation) {
      return res.status(400).json({
        message: "La salle est déjà réservée sur ce créneau horaire",
      });
    }

    // Créer la réservation
    const newReservation = new Reservation({
      roomId,
      floorNumber,
      userId: req.user ? req.user._id : undefined,
      name,
      email,
      date: reservationDate,
      startTime,
      endTime,
      purpose,
      notes,
    });

    await newReservation.save();

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Récupérer toutes les réservations
// @route   GET /api/reservations
// @access  Private (Admin)
const getReservations = async (req, res) => {
  try {
    const { roomId, date, userId } = req.query;
    const query = {};

    if (roomId) {
      query.roomId = roomId;
    }

    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      query.date = queryDate;
    }

    if (userId) {
      query.userId = userId;
    }

    const reservations = await Reservation.find(query).sort({
      date: 1,
      startTime: 1,
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Récupérer les réservations de l'utilisateur connecté
// @route   GET /api/reservations/my
// @access  Private
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id }).sort({
      date: 1,
      startTime: 1,
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Récupérer une réservation par ID
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
      req.user.role !== "admin" &&
      reservation.userId &&
      reservation.userId.toString() !== req.user._id.toString()
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
      req.user.role !== "admin" &&
      reservation.userId &&
      reservation.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Si la date ou les heures changent, vérifier les conflits
    if (req.body.date || req.body.startTime || req.body.endTime) {
      const date = req.body.date ? new Date(req.body.date) : reservation.date;
      date.setHours(0, 0, 0, 0);

      const startTime = req.body.startTime || reservation.startTime;
      const endTime = req.body.endTime || reservation.endTime;

      const existingReservation = await Reservation.findOne({
        roomId: reservation.roomId,
        date: date,
        _id: { $ne: req.params.id },
        $or: [
          {
            startTime: { $lte: startTime },
            endTime: { $gt: startTime },
          },
          {
            startTime: { $lt: endTime },
            endTime: { $gte: endTime },
          },
          {
            startTime: { $gte: startTime },
            endTime: { $lte: endTime },
          },
        ],
      });

      if (existingReservation) {
        return res.status(400).json({
          message: "La salle est déjà réservée sur ce créneau horaire",
        });
      }
    }

    // Mettre à jour la réservation
    Object.keys(req.body).forEach((key) => {
      if (key === "date") {
        const date = new Date(req.body.date);
        date.setHours(0, 0, 0, 0);
        reservation.date = date;
      } else {
        reservation[key] = req.body[key];
      }
    });

    await reservation.save();

    res.json(reservation);
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
      req.user.role !== "admin" &&
      reservation.userId &&
      reservation.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await reservation.remove();

    res.json({ message: "Réservation supprimée avec succès" });
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
  deleteReservation,
};
