import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Event as EventIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CalendarToday as CalendarTodayIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { reservationService } from "../services/apiService";
import ReservationCard from "./ReservationCard";

const ReservationList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Récupérer les réservations au chargement
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await reservationService.getMyReservations();
        setReservations(response);
        setLoading(false);
      } catch (err) {
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des réservations"
        );
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Filtrer les réservations selon l'onglet et la recherche
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered;

    // Filtrer par onglet
    if (tabValue === 0) {
      // Toutes
      filtered = [...reservations];
    } else if (tabValue === 1) {
      // À venir
      filtered = reservations.filter((res) => new Date(res.date) >= today);
    } else {
      // Passées
      filtered = reservations.filter((res) => new Date(res.date) < today);
    }

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (res) =>
          res.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
          res.roomId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (res.notes &&
            res.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Trier par date
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredReservations(filtered);
  }, [reservations, tabValue, searchQuery]);

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gérer la recherche
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Ouvrir le dialogue de suppression
  const handleOpenDeleteDialog = (reservation) => {
    setReservationToDelete(reservation);
    setOpenDeleteDialog(true);
  };

  // Fermer le dialogue de suppression
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setReservationToDelete(null);
  };

  // Supprimer une réservation
  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return;

    try {
      setDeleting(true);
      await reservationService.deleteReservation(reservationToDelete._id);
      setReservations((prev) =>
        prev.filter((r) => r._id !== reservationToDelete._id)
      );
      setDeleting(false);
      handleCloseDeleteDialog();
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la suppression");
      setDeleting(false);
    }
  };

  // Formatter la date pour l'affichage
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  if (loading && reservations.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Mes réservations</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Nouvelle réservation
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher dans mes réservations..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<EventIcon />} label="Toutes" iconPosition="start" />
          <Tab
            icon={<CalendarTodayIcon />}
            label="À venir"
            iconPosition="start"
          />
          <Tab icon={<HistoryIcon />} label="Passées" iconPosition="start" />
        </Tabs>
      </Box>

      {filteredReservations.length === 0 ? (
        <Alert severity="info">Aucune réservation trouvée.</Alert>
      ) : (
        <Box>
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              onDelete={handleOpenDeleteDialog}
            />
          ))}
        </Box>
      )}

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Supprimer la réservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette réservation ?
            {reservationToDelete && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDate(reservationToDelete.date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Horaires:</strong> {reservationToDelete.startTime} -{" "}
                  {reservationToDelete.endTime}
                </Typography>
                <Typography variant="body2">
                  <strong>Salle:</strong> {reservationToDelete.roomId} (Étage{" "}
                  {reservationToDelete.floorNumber})
                </Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteReservation}
            color="error"
            disabled={deleting}
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservationList;
