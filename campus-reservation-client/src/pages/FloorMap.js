import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Chip,
  Fade,
  LinearProgress,
} from "@mui/material";
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  FilterList as FilterListIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  LocationOn as LocationOnIcon,
  Tune as TuneIcon,
} from "@mui/icons-material";
import { floorService } from "../services/apiService";
import RoomCard from "../components/floor/RoomCard";

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

  // Fetch floor data
  useEffect(() => {
    const fetchFloorData = async () => {
      try {
        setLoading(true);

        // Get all floors for navigation
        const floorsData = await floorService.getAllFloors();
        setAllFloors(floorsData.sort((a, b) => a.floorNumber - b.floorNumber));

        // Get specific floor info
        const floorData = await floorService.getFloorByNumber(floorNumber);
        setFloor(floorData);

        // Get rooms with their status
        const roomsData = await floorService.getRoomsByFloor(floorNumber);
        setRooms(roomsData.filter((element) => element.type === "room"));

        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while loading data");
        setLoading(false);
      }
    };

    fetchFloorData();
  }, [floorNumber]);

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    if (filter === "all") return true;
    if (filter === "available") return room.status === "available";
    if (filter === "reserved") return room.status === "reserved";
    // Filter by capacity
    if (filter === "small") return room.capacity <= 20;
    if (filter === "medium") return room.capacity > 20 && room.capacity <= 50;
    if (filter === "large") return room.capacity > 50;
    return true;
  });

  // Handle filter menu
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

  // Navigate between floors
  const navigateToFloor = (floorNum) => {
    navigate(`/floor/${floorNum}`);
  };

  // Find previous and next floors
  const currentFloorIndex = allFloors.findIndex(
    (f) => f.floorNumber === parseInt(floorNumber)
  );
  const hasPreviousFloor = currentFloorIndex > 0;
  const hasNextFloor = currentFloorIndex < allFloors.length - 1;

  // Statistiques des salles
  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === "available").length,
    reserved: rooms.filter(r => r.status === "reserved").length,
  };

  const filterOptions = [
    { key: "all", label: "Toutes les salles", count: roomStats.total },
    { key: "available", label: "Disponibles", count: roomStats.available },
    { key: "reserved", label: "Réservées", count: roomStats.reserved },
    { key: "small", label: "Petites (≤ 20)", count: rooms.filter(r => r.capacity <= 20).length },
    { key: "medium", label: "Moyennes (21-50)", count: rooms.filter(r => r.capacity > 20 && r.capacity <= 50).length },
    { key: "large", label: "Grandes (> 50)", count: rooms.filter(r => r.capacity > 50).length },
  ];

  if (loading) {
    return (
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <CircularProgress sx={{ color: "#3730a3" }} />
            <Typography variant="h6" sx={{ mt: 2, color: "#64748b" }}>
              Chargement de l'étage {floorNumber}...
            </Typography>
          </Box>
          <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
        </Container>
      </Box>
    );
  }

  if (error) {
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
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              backgroundColor: "#3730a3",
              "&:hover": { backgroundColor: "#1e40af" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Retour au tableau de bord
          </Button>
        </Container>
      </Box>
    );
  }

  if (!floor) {
    return (
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
        <Container>
          <Alert 
            severity="warning"
            sx={{
              borderRadius: 3,
              border: "1px solid #fbbf24",
              mb: 3,
            }}
          >
            L'étage {floorNumber} n'existe pas.
          </Alert>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              backgroundColor: "#3730a3",
              "&:hover": { backgroundColor: "#1e40af" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Retour au tableau de bord
          </Button>
        </Container>
      </Box>
    );
  }

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
          <Typography
            sx={{ 
              display: "flex", 
              alignItems: "center",
              color: "#1e293b",
              fontWeight: 600,
            }}
          >
            <BusinessIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Étage {floorNumber}
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            background: "white",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #3730a3 0%, #1e40af 100%)",
                  color: "white",
                  mr: 3,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 32 }} />
              </Box>
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
                  {floor.name}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: "#64748b",
                    fontWeight: 400,
                  }}
                >
                  Étage {floorNumber} • {rooms.length} salles disponibles
                </Typography>
              </Box>
            </Box>

            {/* Navigation et filtre */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Étage précédent">
                <IconButton
                  disabled={!hasPreviousFloor}
                  onClick={() => navigateToFloor(allFloors[currentFloorIndex - 1].floorNumber)}
                  sx={{
                    backgroundColor: hasPreviousFloor ? "#f1f5f9" : "transparent",
                    color: hasPreviousFloor ? "#3730a3" : "#94a3b8",
                    "&:hover": {
                      backgroundColor: hasPreviousFloor ? "#e2e8f0" : "transparent",
                    },
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Filtrer les salles">
                <IconButton 
                  onClick={handleFilterOpen}
                  sx={{
                    backgroundColor: "#f1f5f9",
                    color: "#3730a3",
                    "&:hover": {
                      backgroundColor: "#e2e8f0",
                    },
                  }}
                >
                  <TuneIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Étage suivant">
                <IconButton
                  disabled={!hasNextFloor}
                  onClick={() => navigateToFloor(allFloors[currentFloorIndex + 1].floorNumber)}
                  sx={{
                    backgroundColor: hasNextFloor ? "#f1f5f9" : "transparent",
                    color: hasNextFloor ? "#3730a3" : "#94a3b8",
                    "&:hover": {
                      backgroundColor: hasNextFloor ? "#e2e8f0" : "transparent",
                    },
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Menu filtre */}
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                mt: 1,
              },
            }}
          >
            {filterOptions.map((option) => (
              <MenuItem 
                key={option.key}
                onClick={() => handleFilterChange(option.key)}
                sx={{
                  py: 1.5,
                  px: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                }}
              >
                <Typography sx={{ fontWeight: 500, color: "#1e293b" }}>
                  {option.label}
                </Typography>
                <Chip
                  label={option.count}
                  size="small"
                  sx={{
                    backgroundColor: filter === option.key ? "#3730a3" : "#e2e8f0",
                    color: filter === option.key ? "white" : "#64748b",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </MenuItem>
            ))}
          </Menu>

          {/* Statistiques rapides */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center", p: 2, borderRadius: 2, backgroundColor: "#f8fafc" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#3730a3" }}>
                  {roomStats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                  Total des salles
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center", p: 2, borderRadius: 2, backgroundColor: "#f0fdf4" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#059669" }}>
                  {roomStats.available}
                </Typography>
                <Typography variant="body2" sx={{ color: "#064e3b", fontWeight: 500 }}>
                  Disponibles
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center", p: 2, borderRadius: 2, backgroundColor: "#fef2f2" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#dc2626" }}>
                  {roomStats.reserved}
                </Typography>
                <Typography variant="body2" sx={{ color: "#7f1d1d", fontWeight: 500 }}>
                  Réservées
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Grille des salles */}
        <Fade in={!loading} timeout={600}>
          <Box>
            {filteredRooms.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "white",
                }}
              >
                <BusinessIcon sx={{ fontSize: 64, color: "#94a3b8", mb: 2 }} />
                <Typography variant="h5" sx={{ color: "#64748b", mb: 1, fontWeight: 600 }}>
                  Aucune salle trouvée
                </Typography>
                <Typography variant="body1" sx={{ color: "#94a3b8" }}>
                  Aucune salle ne correspond aux critères sélectionnés.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {filteredRooms.map((room) => (
                  <Grid item xs={12} sm={6} lg={4} key={room.id}>
                    <RoomCard room={room} floorNumber={floorNumber} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default FloorMap;
