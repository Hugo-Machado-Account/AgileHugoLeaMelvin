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
  CardMedia,
  CardActionArea,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Event as EventIcon,
  Room as RoomIcon,
  Today as TodayIcon,
  ArrowForward as ArrowForwardIcon,
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

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement du tableau de bord...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenue, {user?.firstName} !
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Que souhaitez-vous faire aujourd'hui ?
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Section des étages */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" component="h2">
                <RoomIcon
                  color="primary"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                Étages et Salles
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/my-reservations")}
                endIcon={<ArrowForwardIcon />}
              >
                Voir mes réservations
              </Button>
            </Box>

            <Grid container spacing={2}>
              {floors.length > 0 ? (
                floors.map((floor) => (
                  <Grid item xs={12} sm={6} md={4} key={floor._id}>
                    <Card sx={{ height: "100%" }}>
                      <CardActionArea
                        onClick={() => navigateToFloor(floor.floorNumber)}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={`/api/placeholder/400/140?text=Étage ${floor.floorNumber}`}
                          alt={`Étage ${floor.floorNumber}`}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {floor.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Étage {floor.floorNumber}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              size="small"
                              label={`${
                                floor.elements.filter((e) => e.type === "room")
                                  .length
                              } salles`}
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary">
                    Aucun étage disponible
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Section des réservations à venir */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" component="h2">
                <TodayIcon
                  color="primary"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                Prochaines réservations
              </Typography>
            </Box>

            {upcomingReservations.length > 0 ? (
              <List>
                {upcomingReservations.map((reservation) => (
                  <React.Fragment key={reservation._id}>
                    <ListItem
                      button
                      onClick={() =>
                        navigate(
                          `/room/${reservation.floorNumber}/${reservation.roomId}`
                        )
                      }
                      sx={{ flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <EventIcon color="secondary" sx={{ mr: 1 }} />
                          <ListItemText
                            primary={formatDate(reservation.date)}
                            secondary={`${reservation.startTime} - ${reservation.endTime}`}
                          />
                        </Box>
                        <Chip
                          size="small"
                          label={`Salle ${reservation.roomId}`}
                          color="secondary"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {reservation.purpose}
                      </Typography>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Vous n'avez aucune réservation à venir.
              </Typography>
            )}

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/my-reservations")}
                endIcon={<ArrowForwardIcon />}
              >
                Toutes mes réservations
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
