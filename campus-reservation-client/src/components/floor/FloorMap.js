import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Badge,
} from "@mui/material";
import {
  Home as HomeIcon,
  Room as RoomIcon,
  FilterList as FilterListIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { floorService } from "../services/apiService";

const FloorMap = () => {
  const { floorNumber } = useParams();
  const navigate = useNavigate();
  const [floor, setFloor] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [allFloors, setAllFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filter, setFilter] = useState("all");

  // Récupérer les informations de l'étage
  useEffect(() => {
    const fetchFloorData = async () => {
      try {
        setLoading(true);

        // Récupérer tous les étages pour la navigation
        const floorsData = await floorService.getAllFloors();
        setAllFloors(floorsData.sort((a, b) => a.floorNumber - b.floorNumber));

        // Récupérer les informations de l'étage spécifique
        const floorData = await floorService.getFloorByNumber(floorNumber);
        setFloor(floorData);

        // Récupérer les salles avec leur statut
        const roomsData = await floorService.getRoomsByFloor(floorNumber);
        setRooms(roomsData.filter((element) => element.type === "room"));

        setLoading(false);
      } catch (err) {
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des données"
        );
        setLoading(false);
      }
    };

    fetchFloorData();
  }, [floorNumber]);

  // Filtrer les salles
  const filteredRooms = rooms.filter((room) => {
    if (filter === "all") return true;
    if (filter === "available") return room.status === "available";
    if (filter === "reserved") return room.status === "reserved";
    // Filtre par capacité
    if (filter === "small") return room.capacity <= 20;
    if (filter === "medium") return room.capacity > 20 && room.capacity <= 50;
    if (filter === "large") return room.capacity > 50;
    return true;
  });

  // Gérer les filtres
  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    handleFilterClose();
  };

  // Navigation entre les étages
  const navigateToFloor = (floorNum) => {
    navigate(`/floor/${floorNum}`);
  };

  // Trouver les étages précédent et suivant
  const currentFloorIndex = allFloors.findIndex(
    (f) => f.floorNumber === parseInt(floorNumber)
  );
  const hasPreviousFloor = currentFloorIndex > 0;
  const hasNextFloor = currentFloorIndex < allFloors.length - 1;

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement de l'étage {floorNumber}...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          startIcon={<HomeIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Retour au tableau de bord
        </Button>
      </Container>
    );
  }

  if (!floor) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="warning">L'étage {floorNumber} n'existe pas.</Alert>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          startIcon={<HomeIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Retour au tableau de bord
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
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <RoomIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Étage {floorNumber}
        </Typography>
      </Breadcrumbs>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {floor.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Étage {floorNumber} - {rooms.length} salles disponibles
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              disabled={!hasPreviousFloor}
              onClick={() =>
                navigateToFloor(allFloors[currentFloorIndex - 1].floorNumber)
              }
              aria-label="étage précédent"
            >
              <NavigateBeforeIcon />
            </IconButton>

            <Tooltip title="Filtrer les salles">
              <IconButton onClick={handleFilterOpen} aria-label="filtrer">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => handleFilterChange("all")}>
                Toutes les salles
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("available")}>
                Salles disponibles
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("reserved")}>
                Salles réservées
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("small")}>
                Petite capacité (≤ 20)
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("medium")}>
                Moyenne capacité (21-50)
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("large")}>
                Grande capacité (supérieur à 50)
              </MenuItem>
            </Menu>

            <IconButton
              disabled={!hasNextFloor}
              onClick={() =>
                navigateToFloor(allFloors[currentFloorIndex + 1].floorNumber)
              }
              aria-label="étage suivant"
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Box>

        {filter !== "all" && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Filtre: ${
                filter === "available"
                  ? "Disponibles"
                  : filter === "reserved"
                  ? "Réservées"
                  : filter === "small"
                  ? "Petite capacité"
                  : filter === "medium"
                  ? "Moyenne capacité"
                  : filter === "large"
                  ? "Grande capacité"
                  : "Tous"
              }`}
              onDelete={() => setFilter("all")}
              color="primary"
            />
          </Box>
        )}

        {/* Grille de salles */}
        {filteredRooms.length === 0 ? (
          <Alert severity="info">
            Aucune salle ne correspond aux critères sélectionnés.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Badge
                  color={room.status === "available" ? "success" : "error"}
                  badgeContent={
                    room.status === "available" ? (
                      <CheckIcon fontSize="small" />
                    ) : (
                      <CloseIcon fontSize="small" />
                    )
                  }
                  overlap="circular"
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Card sx={{ height: "100%" }}>
                    <CardActionArea
                      onClick={() =>
                        navigate(`/room/${floorNumber}/${room.id}`)
                      }
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={`/api/placeholder/300/140?text=Salle ${room.name}`}
                        alt={`Salle ${room.name}`}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {room.name}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <PeopleIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Capacité: {room.capacity} personnes
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            mt: 1,
                          }}
                        >
                          {room.equipments &&
                            room.equipments.map((equipment, index) => (
                              <Chip
                                key={index}
                                label={equipment}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          {room.roomType && (
                            <Chip
                              label={room.roomType}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Badge>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default FloorMap;
