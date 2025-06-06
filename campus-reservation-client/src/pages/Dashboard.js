import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActionArea,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  Event as EventIcon,
  Room as RoomIcon,
  Today as TodayIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { floorService, reservationService } from "../services/apiService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [floors, setFloors] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer les étages
        const floorsData = await floorService.getAllFloors();
        setFloors(floorsData);

        // Récupérer les réservations à venir
        const reservationsData = await reservationService.getMyReservations();

        // Filtrer pour les réservations futures
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = reservationsData
          .filter((reservation) => new Date(reservation.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5); // Limiter à 5 réservations

        setUpcomingReservations(upcoming);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Une erreur est survenue");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Formater la date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Navigation vers un étage
  const navigateToFloor = (floorNumber) => {
    navigate(`/floor/${floorNumber}`);
  };

  // Statistiques rapides
  const quickStats = [
    {
      title: "Réservations à venir",
      value: upcomingReservations.length,
      icon: <EventIcon />,
      color: "#3730a3",
    },
    {
      title: "Étages disponibles",
      value: floors.length,
      icon: <RoomIcon />,
      color: "#059669",
    },
    {
      title: "Utilisation",
      value: "94%",
      icon: <TrendingUpIcon />,
      color: "#dc2626",
    },
  ];

  if (loading) {
    return (
      <Container sx={{ py: 5 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <CircularProgress sx={{ color: "#3730a3" }} />
          <Typography variant="h6" sx={{ mt: 2, color: "#64748b" }}>
            Chargement du tableau de bord...
          </Typography>
        </Box>
        <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              border: "1px solid #fca5a5",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mr: 3,
                backgroundColor: "#3730a3",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              {user?.firstName?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  color: "#1e293b",
                  letterSpacing: "-0.02em",
                  mb: 0.5,
                }}
              >
                Bienvenue, {user?.firstName} !
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: "#64748b",
                  fontWeight: 400,
                }}
              >
                Gérez vos réservations et explorez les espaces disponibles
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats rapides */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickStats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
                  {stat.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Section des étages */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                background: "white",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: "#3730a315",
                      color: "#3730a3",
                      mr: 2,
                    }}
                  >
                    <RoomIcon />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    Étages et Salles
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/my-reservations")}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderColor: "#3730a3",
                    color: "#3730a3",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#1e40af",
                      backgroundColor: "#3730a308",
                    },
                  }}
                >
                  Mes réservations
                </Button>
              </Box>

              <Grid container spacing={3}>
                {floors.length > 0 ? (
                  floors.map((floor) => (
                    <Grid item xs={12} sm={6} lg={4} key={floor._id}>
                      <Card
                        elevation={0}
                        sx={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 3,
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <CardActionArea onClick={() => navigateToFloor(floor.floorNumber)}>
                          <Box
                            sx={{
                              height: 120,
                              background: `linear-gradient(135deg, #3730a3 0%, #1e40af 100%)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                            }}
                          >
                            <Box sx={{ textAlign: "center" }}>
                              <LocationOnIcon sx={{ fontSize: 32, mb: 1 }} />
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Étage {floor.floorNumber}
                              </Typography>
                            </Box>
                          </Box>
                          <CardContent sx={{ p: 3 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600,
                                color: "#1e293b",
                                mb: 1,
                              }}
                            >
                              {floor.name}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip
                                size="small"
                                label={`${floor.elements.filter((e) => e.type === "room").length} salles`}
                                sx={{
                                  backgroundColor: "#3730a315",
                                  color: "#3730a3",
                                  fontWeight: 500,
                                }}
                              />
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <RoomIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }} />
                      <Typography variant="h6" sx={{ color: "#64748b" }}>
                        Aucun étage disponible
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Section des réservations à venir */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                background: "white",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "#05966915",
                    color: "#059669",
                    mr: 2,
                  }}
                >
                  <TodayIcon />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Prochaines réservations
                </Typography>
              </Box>

              {upcomingReservations.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {upcomingReservations.map((reservation, index) => (
                    <ListItem
                      key={reservation._id}
                      onClick={() => navigate(`/room/${reservation.floorNumber}/${reservation.roomId}`)}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f1f5f9",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600,
                              color: "#1e293b",
                            }}
                          >
                            {formatDate(reservation.date)}
                          </Typography>
                          <Chip
                            size="small"
                            label={`Salle ${reservation.roomId}`}
                            sx={{
                              backgroundColor: "#05966915",
                              color: "#059669",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: "#64748b", mr: 0.5 }} />
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {reservation.startTime} - {reservation.endTime}
                          </Typography>
                        </Box>
                        {reservation.purpose && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: "#64748b",
                              fontStyle: "italic",
                            }}
                          >
                            {reservation.purpose}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <EventIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#64748b", mb: 2 }}>
                    Aucune réservation à venir
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Explorez les étages pour réserver une salle
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/my-reservations")}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: "#3730a3",
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#1e40af",
                    },
                  }}
                >
                  Voir toutes mes réservations
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
