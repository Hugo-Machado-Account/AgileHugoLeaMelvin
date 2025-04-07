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
} from "@mui/material";
import {
  Home as HomeIcon,
  Room as RoomIcon,
  FilterList as FilterListIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
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

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading floor {floorNumber}...
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
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  if (!floor) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="warning">Floor {floorNumber} does not exist.</Alert>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          startIcon={<HomeIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Return to Dashboard
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
          Home
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <RoomIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Floor {floorNumber}
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
              Floor {floorNumber} - {rooms.length} available rooms
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              disabled={!hasPreviousFloor}
              onClick={() =>
                navigateToFloor(allFloors[currentFloorIndex - 1].floorNumber)
              }
              aria-label="previous floor"
            >
              <NavigateBeforeIcon />
            </IconButton>

            <Tooltip title="Filter rooms">
              <IconButton onClick={handleFilterOpen} aria-label="filter">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => handleFilterChange("all")}>
                All rooms
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("available")}>
                Available rooms
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("reserved")}>
                Reserved rooms
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("small")}>
                Small capacity (≤ 20)
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("medium")}>
                Medium capacity (21-50)
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("large")}>
                Large capacity ({">"} 50)
              </MenuItem>
            </Menu>

            <IconButton
              disabled={!hasNextFloor}
              onClick={() =>
                navigateToFloor(allFloors[currentFloorIndex + 1].floorNumber)
              }
              aria-label="next floor"
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Rooms grid */}
        {filteredRooms.length === 0 ? (
          <Alert severity="info">No rooms match the selected criteria.</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <RoomCard room={room} floorNumber={floorNumber} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default FloorMap;
