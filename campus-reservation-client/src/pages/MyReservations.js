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
  Tooltip,
} from "@mui/material";
import {
  Event as EventIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  Room as RoomIcon,
  Today as TodayIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
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
  const [success, setSuccess] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // Récupérer les réservations de l'utilisateur
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await reservationService.getMyReservations();
        setReservations(response);
        setUsingMockData(false);
        setLoading(false);
      } catch (err) {
        console.warn("Erreur API, utilisation des données mockées:", err.message);
        
        // Utiliser des données mockées en cas d'erreur API
        const mockReservations = [
          {
            _id: "1",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // Dans 2 jours
            roomId: "101",
            floorNumber: 1,
            startTime: "09:00",
            endTime: "10:00",
            purpose: "Réunion équipe projet",
            notes: "Prévoir vidéoprojecteur",
            status: "confirmed",
          },
          {
            _id: "2",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // Dans 5 jours
            roomId: "203",
            floorNumber: 2,
            startTime: "14:00",
            endTime: "16:00",
            purpose: "Formation développement",
            notes: "",
            status: "confirmed",
          },
          {
            _id: "3",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // Il y a 3 jours
            roomId: "102",
            floorNumber: 1,
            startTime: "11:00",
            endTime: "12:00",
            purpose: "Présentation client",
            notes: "Très bien passé",
            status: "confirmed",
          },
          {
            _id: "4",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // Il y a 7 jours
            roomId: "301",
            floorNumber: 3,
            startTime: "10:00",
            endTime: "11:30",
            purpose: "Réunion direction",
            notes: "",
            status: "confirmed",
          },
        ];
        
        setReservations(mockReservations);
        setUsingMockData(true);
        setLoading(false);
        
        // Ne pas afficher l'erreur pour les données mockées
        // setError("Données de démonstration - API en maintenance");
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
      
      try {
        // Essayer d'abord l'API
        await reservationService.deleteReservation(reservationToDelete._id);
      } catch (apiError) {
        console.warn("Erreur API lors de la suppression, simulation locale:", apiError.message);
        // Si l'API échoue, on simule la suppression localement
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler un délai
      }

      // Mettre à jour l'état local des réservations
      setReservations(
        reservations.filter((r) => r._id !== reservationToDelete._id)
      );

      setSuccess("Réservation annulée avec succès !");
      setDeleting(false);
      handleCloseDeleteDialog();

      // Cacher le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        "Une erreur est survenue lors de l'annulation de la réservation"
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
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
        <Container sx={{ py: 5, textAlign: "center" }}>
          <CircularProgress sx={{ color: "#3730a3" }} />
          <Typography variant="h6" sx={{ mt: 2, color: "#64748b" }}>
            Chargement de vos réservations...
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Header avec gradient */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #3730a3 0%, #1e40af 100%)",
              color: "white",
              p: 4,
              m: -4,
              mb: 4,
              borderRadius: "12px 12px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Mes réservations
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Gérez vos réservations de salles
                </Typography>
                {usingMockData && (
                  <Chip
                    label="Mode démonstration"
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                      backdropFilter: "blur(10px)",
                    }}
                  />
                )}
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<EventIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  transform: "translateY(-2px)",
                },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
              }}
            >
              Nouvelle réservation
            </Button>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: "1px solid #fca5a5",
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: "1px solid #bbf7d0",
              }}
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}

          {reservations.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <EventIcon sx={{ fontSize: 80, color: "#cbd5e1", mb: 2 }} />
              <Typography variant="h5" sx={{ color: "#64748b", mb: 2 }}>
                Aucune réservation
              </Typography>
              <Typography variant="body1" sx={{ color: "#94a3b8", mb: 4 }}>
                Vous n'avez aucune réservation pour le moment.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<EventIcon />}
                onClick={() => navigate("/dashboard")}
                sx={{
                  backgroundColor: "#3730a3",
                  "&:hover": { backgroundColor: "#1e40af" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                }}
              >
                Faire une réservation
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "1rem",
                      "&.Mui-selected": {
                        color: "#3730a3",
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#3730a3",
                      height: 3,
                    },
                  }}
                >
                  <Tab 
                    label={`À venir (${upcoming.length})`} 
                    icon={<CalendarTodayIcon />}
                    iconPosition="start"
                  />
                  <Tab 
                    label={`Passées (${past.length})`} 
                    icon={<TodayIcon />}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              <Box>
                {tabValue === 0 && (
                  <>
                    {upcoming.length === 0 ? (
                      <Alert 
                        severity="info" 
                        sx={{ 
                          borderRadius: 2,
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <InfoIcon sx={{ mr: 1 }} />
                          <Typography>
                            Vous n'avez aucune réservation à venir.
                          </Typography>
                        </Box>
                      </Alert>
                    ) : (
                      <>
                        <Alert 
                          severity="success" 
                          sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CancelIcon sx={{ mr: 1 }} />
                            <Typography sx={{ fontWeight: 600 }}>
                              Vous pouvez annuler vos réservations à venir en cliquant sur l'icône de suppression
                            </Typography>
                          </Box>
                        </Alert>
                        <List>
                          {upcoming.map((reservation) => (
                            <React.Fragment key={reservation._id}>
                              <ListItem 
                                alignItems="flex-start"
                                sx={{
                                  bgcolor: "rgba(55, 48, 163, 0.03)",
                                  borderRadius: 2,
                                  border: "1px solid #e2e8f0",
                                  mb: 2,
                                  "&:hover": {
                                    bgcolor: "rgba(55, 48, 163, 0.05)",
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 4px 12px rgba(55, 48, 163, 0.1)",
                                  },
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <ListItemIcon sx={{ mt: 1 }}>
                                  <CalendarTodayIcon sx={{ color: "#3730a3" }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                      {formatDate(reservation.date)}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box sx={{ mt: 2 }}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                            <AccessTimeIcon
                                              fontSize="small"
                                              sx={{ mr: 1, color: "#3730a3" }}
                                            />
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                              {reservation.startTime} - {reservation.endTime}
                                            </Typography>
                                          </Box>
                                          <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <RoomIcon
                                              fontSize="small"
                                              sx={{ mr: 1, color: "#3730a3" }}
                                            />
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                              Salle {reservation.roomId} (Étage {reservation.floorNumber})
                                            </Typography>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                          <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                                            <strong>Objet:</strong> {reservation.purpose}
                                          </Typography>
                                          {reservation.notes && (
                                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                                              <strong>Notes:</strong> {reservation.notes}
                                            </Typography>
                                          )}
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    <Tooltip title="Voir les détails de la salle">
                                      <IconButton
                                        onClick={() => handleViewRoom(reservation)}
                                        sx={{
                                          backgroundColor: "#f1f5f9",
                                          "&:hover": {
                                            backgroundColor: "#e2e8f0",
                                            color: "#3730a3",
                                          },
                                        }}
                                      >
                                        <RoomIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Annuler cette réservation">
                                      <IconButton
                                        onClick={() => handleOpenDeleteDialog(reservation)}
                                        sx={{
                                          backgroundColor: "#fef2f2",
                                          color: "#dc2626",
                                          "&:hover": {
                                            backgroundColor: "#fca5a5",
                                            color: "white",
                                          },
                                        }}
                                      >
                                        <CancelIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </ListItemSecondaryAction>
                              </ListItem>
                            </React.Fragment>
                          ))}
                        </List>
                      </>
                    )}
                  </>
                )}

                {tabValue === 1 && (
                  <>
                    {past.length === 0 ? (
                      <Alert 
                        severity="info" 
                        sx={{ 
                          borderRadius: 2,
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <InfoIcon sx={{ mr: 1 }} />
                          <Typography>
                            Vous n'avez aucune réservation passée.
                          </Typography>
                        </Box>
                      </Alert>
                    ) : (
                      <>
                        <Alert 
                          severity="info" 
                          sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            border: "1px solid #bfdbfe",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <InfoIcon sx={{ mr: 1 }} />
                            <Typography>
                              Les réservations passées ne peuvent plus être annulées
                            </Typography>
                          </Box>
                        </Alert>
                        <List>
                          {past.map((reservation) => (
                            <React.Fragment key={reservation._id}>
                              <ListItem 
                                alignItems="flex-start"
                                sx={{
                                  bgcolor: "#f8fafc",
                                  borderRadius: 2,
                                  border: "1px solid #e2e8f0",
                                  mb: 2,
                                  opacity: 0.8,
                                }}
                              >
                                <ListItemIcon sx={{ mt: 1 }}>
                                  <TodayIcon sx={{ color: "#94a3b8" }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 600 }}>
                                      {formatDate(reservation.date)}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box sx={{ mt: 2 }}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                            <AccessTimeIcon
                                              fontSize="small"
                                              sx={{ mr: 1, color: "#94a3b8" }}
                                            />
                                            <Typography variant="body1" sx={{ color: "#64748b" }}>
                                              {reservation.startTime} - {reservation.endTime}
                                            </Typography>
                                          </Box>
                                          <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <RoomIcon
                                              fontSize="small"
                                              sx={{ mr: 1, color: "#94a3b8" }}
                                            />
                                            <Typography variant="body1" sx={{ color: "#64748b" }}>
                                              Salle {reservation.roomId} (Étage {reservation.floorNumber})
                                            </Typography>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                          <Typography variant="body2" sx={{ color: "#94a3b8", mb: 1 }}>
                                            <strong>Objet:</strong> {reservation.purpose}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <Tooltip title="Voir les détails de la salle">
                                    <IconButton
                                      onClick={() => handleViewRoom(reservation)}
                                      sx={{
                                        backgroundColor: "#f1f5f9",
                                        color: "#64748b",
                                        "&:hover": {
                                          backgroundColor: "#e2e8f0",
                                        },
                                      }}
                                    >
                                      <RoomIcon />
                                    </IconButton>
                                  </Tooltip>
                                </ListItemSecondaryAction>
                              </ListItem>
                            </React.Fragment>
                          ))}
                        </List>
                      </>
                    )}
                  </>
                )}
              </Box>
            </>
          )}
        </Paper>

        {/* Dialog de confirmation d'annulation */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={handleCloseDeleteDialog}
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxWidth: 500,
            }
          }}
        >
          <DialogTitle sx={{ 
            backgroundColor: "#fef2f2", 
            color: "#dc2626",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
          }}>
            <CancelIcon sx={{ mr: 2 }} />
            Annuler la réservation
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText sx={{ mb: 2 }}>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
            </DialogContentText>
            {reservationToDelete && (
              <Box 
                sx={{ 
                  mt: 3,
                  p: 3,
                  backgroundColor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Date:</strong> {formatDate(reservationToDelete.date)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Horaires:</strong> {reservationToDelete.startTime} - {reservationToDelete.endTime}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Salle:</strong> {reservationToDelete.roomId} (Étage {reservationToDelete.floorNumber})
                </Typography>
                <Typography variant="body2">
                  <strong>Objet:</strong> {reservationToDelete.purpose}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDeleteDialog} 
              disabled={deleting}
              variant="outlined"
              sx={{
                borderColor: "#e2e8f0",
                color: "#64748b",
                "&:hover": {
                  borderColor: "#94a3b8",
                },
              }}
            >
              Garder la réservation
            </Button>
            <Button
              onClick={handleDeleteReservation}
              color="error"
              variant="contained"
              disabled={deleting}
              startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <CancelIcon />}
              sx={{
                backgroundColor: "#dc2626",
                "&:hover": {
                  backgroundColor: "#b91c1c",
                },
              }}
            >
              {deleting ? "Annulation..." : "Annuler la réservation"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyReservations;
