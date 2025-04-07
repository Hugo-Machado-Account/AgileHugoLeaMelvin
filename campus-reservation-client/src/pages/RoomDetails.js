import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Home as HomeIcon,
  Room as RoomIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  People as PeopleIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { floorService, reservationService } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

const RoomDetails = () => {
  const { floorNumber, roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [floor, setFloor] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);

        // Récupérer les informations de l'étage
        const floorData = await floorService.getFloorByNumber(floorNumber);
        setFloor(floorData);

        // Récupérer la salle spécifique
        const roomsData = await floorService.getRoomsByFloor(floorNumber);
        const roomData = roomsData.find((r) => r.id === roomId);

        if (!roomData) {
          throw new Error("Salle non trouvée");
        }

        setRoom(roomData);

        // Récupérer les réservations pour cette salle
        // Utilisez filterParams pour obtenir les réservations de cette salle
        const filterParams = { roomId: roomId };
        const reservationsData = await reservationService.getAllReservations(
          filterParams
        );

        // Filtrer pour les réservations futures
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingReservations = reservationsData
          .filter((reservation) => new Date(reservation.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setReservations(upcomingReservations);
        setLoading(false);
      } catch (err) {
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des données"
        );
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [floorNumber, roomId]);

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

  // Verifier si la salle est disponible aujourd'hui
  const isAvailableToday = room && room.status === "available";

  // Ouvrir le dialog de confirmation
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Fermer le dialog de confirmation
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Rediriger vers le formulaire de réservation
  const handleReserve = () => {
    navigate(`/reserve/${floorNumber}/${roomId}`);
  };

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement des informations de la salle...
        </Typography>
      </Container>
    );
  }

  if (error || !room) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">
          {error || "Impossible de trouver les informations de cette salle."}
        </Alert>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/floor/${floorNumber}`)}
        >
          Retour à l'étage {floorNumber}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Accueil
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/floor/${floorNumber}`);
          }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <RoomIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Étage {floorNumber}
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          Salle {room.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Informations de la salle */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {room.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {floor.name} - Étage {floorNumber}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Chip
                    label={
                      room.status === "available" ? "Disponible" : "Réservée"
                    }
                    color={room.status === "available" ? "success" : "error"}
                    icon={
                      room.status === "available" ? (
                        <CheckCircleOutlineIcon />
                      ) : (
                        <EventIcon />
                      )
                    }
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${room.capacity} personnes`}
                    icon={<PeopleIcon />}
                    variant="outlined"
                    color="primary"
                  />
                </Box>
              </Box>

              <Box>
                <Button
                  variant={isAvailableToday ? "contained" : "outlined"}
                  color="primary"
                  startIcon={<EventAvailableIcon />}
                  onClick={handleOpenDialog}
                  disabled={!isAvailableToday}
                >
                  Réserver
                </Button>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>Confirmer la réservation</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Voulez-vous réserver la salle {room.name} à l'étage{" "}
                      {floorNumber} ?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                      Annuler
                    </Button>
                    <Button
                      onClick={handleReserve}
                      color="primary"
                      variant="contained"
                    >
                      Réserver
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Box>

            {/* Image de la salle */}
            <Box
              component="img"
              sx={{
                height: 300,
                width: "100%",
                objectFit: "cover",
                borderRadius: 1,
                mb: 3,
              }}
              alt={`Salle ${room.name}`}
              src={`/api/placeholder/800/300?text=Salle ${room.name}`}
            />

            {/* Caractéristiques */}
            <Typography variant="h6" component="h2" gutterBottom>
              Caractéristiques
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Capacité"
                      secondary={`${room.capacity} personnes`}
                    />
                  </ListItem>
                  {room.roomType && (
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Type de salle"
                        secondary={room.roomType}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Statut"
                      secondary={
                        room.status === "available" ? "Disponible" : "Réservée"
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <RoomIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Emplacement"
                      secondary={`Étage ${floorNumber}`}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            {/* Équipements */}
            <Typography variant="h6" component="h2" gutterBottom>
              Équipements
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {room.equipments && room.equipments.length > 0 ? (
                room.equipments.map((equipment, index) => (
                  <Chip key={index} label={equipment} />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucun équipement spécifié
                </Typography>
              )}
            </Box>

            {/* Description */}
            <Typography variant="h6" component="h2" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {room.description ||
                "Cette salle fait partie de l'étage " +
                  floorNumber +
                  " (" +
                  floor.name +
                  "). " +
                  "Elle peut accueillir jusqu'à " +
                  room.capacity +
                  " personnes et est idéale pour " +
                  (room.roomType
                    ? "les " + room.roomType.toLowerCase() + "s"
                    : "différents types d'événements") +
                  "."}
            </Typography>
          </Paper>
        </Grid>

        {/* Réservations à venir */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CalendarTodayIcon sx={{ mr: 1 }} />
              Réservations à venir
            </Typography>

            {reservations.length > 0 ? (
              <List>
                {reservations.map((reservation) => (
                  <React.Fragment key={reservation._id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemIcon>
                        <EventIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={formatDate(reservation.date)}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {reservation.startTime} - {reservation.endTime}
                            </Typography>
                            {` — ${reservation.purpose}`}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                Aucune réservation à venir pour cette salle.
              </Alert>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                color="primary"
                startIcon={<EventAvailableIcon />}
                onClick={handleOpenDialog}
                disabled={!isAvailableToday}
              >
                Réserver cette salle
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoomDetails;
