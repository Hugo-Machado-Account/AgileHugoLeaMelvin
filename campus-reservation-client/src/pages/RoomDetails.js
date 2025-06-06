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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  LinearProgress,
  Fade,
} from "@mui/material";
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  People as PeopleIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationOnIcon,
  Computer as ComputerIcon,
  Videocam as VideocamIcon,
  Wifi as WifiIcon,
  AcUnit as AcUnitIcon,
  Circle as CircleIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
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

  // Get room type configuration
  const getRoomTypeConfig = (roomType) => {
    switch (roomType?.toLowerCase()) {
      case "classroom":
      case "salle de cours":
        return {
          icon: <SchoolIcon />,
          color: "#3730a3",
          bgColor: "#3730a315",
          label: "Salle de cours"
        };
      case "computer lab":
      case "laboratoire":
        return {
          icon: <ComputerIcon />,
          color: "#059669",
          bgColor: "#05966915",
          label: "Laboratoire"
        };
      case "meeting room":
      case "salle de réunion":
        return {
          icon: <BusinessIcon />,
          color: "#dc2626",
          bgColor: "#dc262615",
          label: "Salle de réunion"
        };
      case "lecture hall":
      case "amphithéâtre":
        return {
          icon: <GroupsIcon />,
          color: "#7c2d12",
          bgColor: "#7c2d1215",
          label: "Amphithéâtre"
        };
      default:
        return {
          icon: <BusinessIcon />,
          color: "#64748b",
          bgColor: "#64748b15",
          label: "Salle"
        };
    }
  };

  // Get equipment icon
  const getEquipmentIcon = (equipment) => {
    const equipmentLower = equipment.toLowerCase();
    if (equipmentLower.includes("projecteur") || equipmentLower.includes("projector"))
      return <VideocamIcon sx={{ color: "#64748b" }} />;
    if (equipmentLower.includes("ordinateur") || equipmentLower.includes("computer"))
      return <ComputerIcon sx={{ color: "#64748b" }} />;
    if (equipmentLower.includes("wifi") || equipmentLower.includes("internet"))
      return <WifiIcon sx={{ color: "#64748b" }} />;
    if (equipmentLower.includes("air") || equipmentLower.includes("climat"))
      return <AcUnitIcon sx={{ color: "#64748b" }} />;
    return <CircleIcon sx={{ color: "#64748b" }} />;
  };

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
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <CircularProgress sx={{ color: "#3730a3" }} />
            <Typography variant="h6" sx={{ mt: 2, color: "#64748b" }}>
          Chargement des informations de la salle...
        </Typography>
          </Box>
          <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
      </Container>
      </Box>
    );
  }

  if (error || !room) {
    return (
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
        <Container>
          <Alert 
            severity="error"
            sx={{
              borderRadius: 3,
              border: "1px solid #fca5a5",
              mb: 3,
            }}
          >
          {error || "Impossible de trouver les informations de cette salle."}
        </Alert>
        <Button
            variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/floor/${floorNumber}`)}
            sx={{
              backgroundColor: "#3730a3",
              "&:hover": { backgroundColor: "#1e40af" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
        >
          Retour à l'étage {floorNumber}
        </Button>
      </Container>
      </Box>
    );
  }

  const roomTypeConfig = getRoomTypeConfig(room.roomType);

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
      {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
            sx={{ 
              display: "flex", 
              alignItems: "center",
              color: "#64748b",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                color: "#3730a3",
              },
            }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Tableau de bord
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/floor/${floorNumber}`);
          }}
            sx={{ 
              display: "flex", 
              alignItems: "center",
              color: "#64748b",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                color: "#3730a3",
              },
            }}
          >
            <BusinessIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Étage {floorNumber}
        </Link>
        <Typography
            sx={{ 
              display: "flex", 
              alignItems: "center",
              color: "#1e293b",
              fontWeight: 600,
            }}
        >
          Salle {room.name}
        </Typography>
      </Breadcrumbs>

        <Fade in={!loading} timeout={600}>
      <Grid container spacing={4}>
        {/* Informations de la salle */}
            <Grid item xs={12} lg={8}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  overflow: "hidden",
                }}
              >
                {/* Header avec gradient */}
            <Box
              sx={{
                    background: isAvailableToday 
                      ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                      : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    color: "white",
                    p: 4,
                    position: "relative",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          mr: 3,
                          backgroundColor: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {roomTypeConfig.icon}
                      </Avatar>
              <Box>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            mb: 1,
                          }}
                        >
                          Salle {room.name}
                </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            opacity: 0.9,
                            fontWeight: 400,
                          }}
                        >
                          {floor.name} • Étage {floorNumber}
                </Typography>
                </Box>
              </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Chip
                        label={isAvailableToday ? "Disponible" : "Réservée"}
                        icon={isAvailableToday ? <CheckCircleOutlineIcon /> : <EventIcon />}
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 600,
                          mb: 2,
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <br />
                <Button
                        variant="contained"
                  startIcon={<EventAvailableIcon />}
                  onClick={handleOpenDialog}
                  disabled={!isAvailableToday}
                        sx={{
                          backgroundColor: "white",
                          color: isAvailableToday ? "#059669" : "#64748b",
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#f8fafc",
                          },
                          "&:disabled": {
                            backgroundColor: "rgba(255,255,255,0.5)",
                            color: "rgba(255,255,255,0.7)",
                          },
                        }}
                      >
                        {isAvailableToday ? "Réserver" : "Non disponible"}
                </Button>
                    </Box>
              </Box>
            </Box>

                <Box sx={{ p: 4 }}>
            {/* Image de la salle */}
            <Box
              sx={{
                      height: 250,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${roomTypeConfig.color} 0%, ${roomTypeConfig.color}aa 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      mb: 4,
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"dots\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><circle cx=\"10\" cy=\"10\" r=\"1\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23dots)\"/></svg>')",
                      },
                    }}
                  >
                    <Box sx={{ textAlign: "center", zIndex: 1 }}>
                      <Box sx={{ fontSize: 64, mb: 2 }}>
                        {roomTypeConfig.icon}
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {roomTypeConfig.label}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.8 }}>
                        Capacité : {room.capacity} personnes
                      </Typography>
                    </Box>
                  </Box>

            {/* Caractéristiques */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <PeopleIcon sx={{ color: "#3730a3", mr: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                            Capacité
                          </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ color: "#3730a3", fontWeight: 700 }}>
                          {room.capacity}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          personnes maximum
            </Typography>
                      </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          backgroundColor: roomTypeConfig.bgColor,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Box sx={{ color: roomTypeConfig.color, mr: 1 }}>
                            {roomTypeConfig.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                            Type de salle
                          </Typography>
                        </Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: roomTypeConfig.color, 
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          {roomTypeConfig.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Étage {floorNumber}
                        </Typography>
                      </Card>
              </Grid>
            </Grid>

            {/* Équipements */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}>
                      Équipements disponibles
            </Typography>
              {room.equipments && room.equipments.length > 0 ? (
                      <Grid container spacing={2}>
                        {room.equipments.map((equipment, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 2,
                                borderRadius: 2,
                                border: "1px solid #e2e8f0",
                                backgroundColor: "white",
                              }}
                            >
                              {getEquipmentIcon(equipment)}
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  ml: 2,
                                  fontWeight: 500,
                                  color: "#1e293b",
                                }}
                              >
                                {equipment}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Alert 
                        severity="info"
                        sx={{
                          borderRadius: 2,
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        Aucun équipement spécifique répertorié pour cette salle.
                      </Alert>
              )}
            </Box>

            {/* Description */}
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}>
              Description
            </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.6 }}>
              {room.description ||
                          `Cette ${roomTypeConfig.label.toLowerCase()} fait partie de l'étage ${floorNumber} (${floor.name}). Elle peut accueillir jusqu'à ${room.capacity} personnes et est parfaitement adaptée pour ${room.roomType ? "les " + room.roomType.toLowerCase() + "s" : "différents types d'événements et de réunions"}.`}
            </Typography>
                    </Paper>
                  </Box>
                </Box>
          </Paper>
        </Grid>

        {/* Réservations à venir */}
            <Grid item xs={12} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  height: "fit-content",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: "#3730a315",
                      color: "#3730a3",
                      mr: 2,
                    }}
                  >
                    <CalendarTodayIcon />
                  </Box>
            <Typography
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
              Réservations à venir
            </Typography>
                </Box>

            {reservations.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {reservations.slice(0, 5).map((reservation, index) => (
                      <ListItem
                        key={reservation._id}
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          border: "1px solid #e2e8f0",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                      <ListItemIcon>
                          <ScheduleIcon sx={{ color: "#3730a3" }} />
                      </ListItemIcon>
                      <ListItemText
                          primary={
                            <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                              {formatDate(reservation.date)}
                            </Typography>
                          }
                        secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: "#64748b" }}>
                                {reservation.startTime} - {reservation.endTime}
                              </Typography>
                              {reservation.purpose && (
                            <Typography
                              variant="body2"
                                  sx={{ 
                                    color: "#3730a3",
                                    fontStyle: "italic",
                                    mt: 0.5,
                                  }}
                                >
                                  {reservation.purpose}
                            </Typography>
                              )}
                            </Box>
                        }
                      />
                    </ListItem>
                ))}
              </List>
            ) : (
                  <Alert 
                    severity="success"
                    sx={{
                      borderRadius: 2,
                      border: "1px solid #bbf7d0",
                      mb: 3,
                    }}
                  >
                    Aucune réservation prévue. Cette salle est libre !
              </Alert>
            )}

              <Button
                  variant="contained"
                fullWidth
                startIcon={<EventAvailableIcon />}
                onClick={handleOpenDialog}
                disabled={!isAvailableToday}
                  sx={{
                    backgroundColor: "#3730a3",
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#1e40af",
                    },
                    "&:disabled": {
                      backgroundColor: "#94a3b8",
                    },
                  }}
                >
                  {isAvailableToday ? "Réserver cette salle" : "Salle non disponible"}
              </Button>
          </Paper>
        </Grid>
      </Grid>
        </Fade>

        {/* Dialog de confirmation */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: "1px solid #e2e8f0",
            },
          }}
        >
          <DialogTitle sx={{ color: "#1e293b", fontWeight: 600 }}>
            Confirmer la réservation
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "#64748b" }}>
              Voulez-vous réserver la salle {room.name} à l'étage {floorNumber} ?
              Cette action vous redirigera vers le formulaire de réservation.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{
                color: "#64748b",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleReserve}
              variant="contained"
              sx={{
                backgroundColor: "#3730a3",
                "&:hover": { backgroundColor: "#1e40af" },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Continuer
            </Button>
          </DialogActions>
        </Dialog>
    </Container>
    </Box>
  );
};

export default RoomDetails;
