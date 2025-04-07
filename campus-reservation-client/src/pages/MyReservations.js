import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Event as EventIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  Room as RoomIcon,
  Today as TodayIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { reservationService } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

// Fonction pour trier les réservations par date
const sortReservationsByDate = (reservations) => {
  return [...reservations].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });
};

// Fonction pour regrouper les réservations par statut (à venir, passées)
const groupReservationsByStatus = (reservations) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = reservations.filter(
    (reservation) => new Date(reservation.date) >= today
  );
  const past = reservations.filter(
    (reservation) => new Date(reservation.date) < today
  );

  return {
    upcoming: sortReservationsByDate(upcoming),
    past: sortReservationsByDate(past),
  };
};

const MyReservations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Récupérer les réservations de l'utilisateur
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

  // Grouper les réservations par statut
  const { upcoming, past } = groupReservationsByStatus(reservations);

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Formatter la date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Ouvrir le dialog de confirmation de suppression
  const handleOpenDeleteDialog = (reservation) => {
    setReservationToDelete(reservation);
    setDeleteDialogOpen(true);
  };

  // Fermer le dialog de confirmation de suppression
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setReservationToDelete(null);
  };

  // Supprimer une réservation
  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return;

    try {
      setDeleting(true);
      await reservationService.deleteReservation(reservationToDelete._id);

      // Mettre à jour l'état local des réservations
      setReservations(
        reservations.filter((r) => r._id !== reservationToDelete._id)
      );

      setDeleting(false);
      handleCloseDeleteDialog();
    } catch (err) {
      setError(
        err.message ||
          "Une erreur est survenue lors de la suppression de la réservation"
      );
      setDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  // Naviguer vers la page de détails d'une salle
  const handleViewRoom = (reservation) => {
    navigate(`/room/${reservation.floorNumber}/${reservation.roomId}`);
  };

  // Naviguer vers la page de modification d'une réservation
  const handleEditReservation = (reservation) => {
    // Cette fonctionnalité pourrait être implémentée plus tard
    // navigate(`/edit-reservation/${reservation._id}`);
    alert("Cette fonctionnalité sera disponible prochainement.");
  };

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement de vos réservations...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Mes réservations
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EventIcon />}
            onClick={() => navigate("/dashboard")}
          >
            Nouvelle réservation
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {reservations.length === 0 ? (
          <Alert severity="info" sx={{ my: 4 }}>
            Vous n'avez aucune réservation pour le moment.
          </Alert>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label={`À venir (${upcoming.length})`} id="tab-0" />
                <Tab label={`Passées (${past.length})`} id="tab-1" />
              </Tabs>
            </Box>

            <Box sx={{ mt: 3 }}>
              {tabValue === 0 && (
                <>
                  {upcoming.length === 0 ? (
                    <Alert severity="info" sx={{ my: 2 }}>
                      Vous n'avez aucune réservation à venir.
                    </Alert>
                  ) : (
                    <List>
                      {upcoming.map((reservation) => (
                        <React.Fragment key={reservation._id}>
                          <ListItem alignItems="flex-start">
                            <ListItemIcon>
                              <CalendarTodayIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="h6" component="div">
                                  {formatDate(reservation.date)}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          mb: 1,
                                        }}
                                      >
                                        <AccessTimeIcon
                                          fontSize="small"
                                          sx={{
                                            mr: 1,
                                            color: "text.secondary",
                                          }}
                                        />
                                        <Typography variant="body2">
                                          {reservation.startTime} -{" "}
                                          {reservation.endTime}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <RoomIcon
                                          fontSize="small"
                                          sx={{
                                            mr: 1,
                                            color: "text.secondary",
                                          }}
                                        />
                                        <Typography variant="body2">
                                          Salle {reservation.roomId} (Étage{" "}
                                          {reservation.floorNumber})
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        <strong>Objet:</strong>{" "}
                                        {reservation.purpose}
                                      </Typography>
                                      {reservation.notes && (
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{ mt: 1 }}
                                        >
                                          <strong>Notes:</strong>{" "}
                                          {reservation.notes}
                                        </Typography>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Box>
                                <IconButton
                                  edge="end"
                                  aria-label="view-room"
                                  onClick={() => handleViewRoom(reservation)}
                                  sx={{ mr: 1 }}
                                >
                                  <RoomIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() =>
                                    handleOpenDeleteDialog(reservation)
                                  }
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </>
              )}

              {tabValue === 1 && (
                <>
                  {past.length === 0 ? (
                    <Alert severity="info" sx={{ my: 2 }}>
                      Vous n'avez aucune réservation passée.
                    </Alert>
                  ) : (
                    <List>
                      {past.map((reservation) => (
                        <React.Fragment key={reservation._id}>
                          <ListItem alignItems="flex-start">
                            <ListItemIcon>
                              <TodayIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="h6"
                                  component="div"
                                  color="text.secondary"
                                >
                                  {formatDate(reservation.date)}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          mb: 1,
                                        }}
                                      >
                                        <AccessTimeIcon
                                          fontSize="small"
                                          sx={{
                                            mr: 1,
                                            color: "text.secondary",
                                          }}
                                        />
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          {reservation.startTime} -{" "}
                                          {reservation.endTime}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <RoomIcon
                                          fontSize="small"
                                          sx={{
                                            mr: 1,
                                            color: "text.secondary",
                                          }}
                                        />
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          Salle {reservation.roomId} (Étage{" "}
                                          {reservation.floorNumber})
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        <strong>Objet:</strong>{" "}
                                        {reservation.purpose}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="view-room"
                                onClick={() => handleViewRoom(reservation)}
                              >
                                <RoomIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </>
              )}
            </Box>
          </>
        )}
      </Paper>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
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
    </Container>
  );
};

export default MyReservations;
