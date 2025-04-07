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
  Tabs,
  Tab,
  InputBase,
  Chip,
  Fade,
  Slide,
  useTheme,
  Card,
  alpha,
} from "@mui/material";
import {
  Home as HomeIcon,
  Room as RoomIcon,
  FilterList as FilterListIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";
import { floorService } from "../services/apiService";
import RoomCard from "../components/floor/RoomCard";

const FloorMap = () => {
  const { floorNumber } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [floor, setFloor] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [allFloors, setAllFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("name");

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

    // Scroll to top when floor changes
    window.scrollTo(0, 0);
  }, [floorNumber]);

  // Filter and sort rooms
  const processedRooms = React.useMemo(() => {
    // First filter by status and capacity
    let filtered = rooms.filter((room) => {
      if (filter === "all") return true;
      if (filter === "available") return room.status === "available";
      if (filter === "reserved") return room.status === "reserved";
      if (filter === "small") return room.capacity <= 20;
      if (filter === "medium") return room.capacity > 20 && room.capacity <= 50;
      if (filter === "large") return room.capacity > 50;
      return true;
    });

    // Then filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((room) => {
        return (
          room.name.toLowerCase().includes(query) ||
          (room.roomType && room.roomType.toLowerCase().includes(query)) ||
          (room.equipments &&
            room.equipments.some((eq) => eq.toLowerCase().includes(query)))
        );
      });
    }

    // Then sort by the selected criteria
    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "capacity") {
        comparison = a.capacity - b.capacity;
      } else if (sortBy === "type") {
        comparison = (a.roomType || "").localeCompare(b.roomType || "");
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [rooms, filter, searchQuery, sortBy, sortDirection]);

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

  // Handle search
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Handle sort
  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortDirection("asc");
    }
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

  // Toggle view mode
  const toggleView = () => {
    setView(view === "grid" ? "list" : "grid");
  };

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h5" sx={{ mt: 3, fontWeight: "medium" }}>
          Loading floor {floorNumber}...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{
            borderRadius: 2,
            mb: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
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
        <Alert
          severity="warning"
          variant="filled"
          sx={{
            borderRadius: 2,
            mb: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          Floor {floorNumber} does not exist.
        </Alert>
        <Button
          variant="contained"
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
      <Breadcrumbs
        sx={{
          mb: 3,
          py: 1.5,
          px: 2,
          borderRadius: 2,
          backgroundColor: "background.paper",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
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
            "&:hover": {
              color: "primary.main",
            },
            transition: "color 0.2s",
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center", fontWeight: "medium" }}
        >
          <RoomIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Floor {floorNumber}
        </Typography>
      </Breadcrumbs>

      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(45deg, ${alpha(
              theme.palette.primary.light,
              0.15
            )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 3,
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                color="primary.main"
              >
                {floor.name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Floor {floorNumber} • {rooms.length} rooms available
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                disabled={!hasPreviousFloor}
                onClick={() =>
                  navigateToFloor(allFloors[currentFloorIndex - 1].floorNumber)
                }
                aria-label="previous floor"
                color="primary"
                sx={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "background.paper",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>

              <Tooltip title="Filter rooms">
                <IconButton
                  onClick={handleFilterOpen}
                  aria-label="filter"
                  color="primary"
                  sx={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    bgcolor: "background.paper",
                    "&:hover": {
                      bgcolor: "background.paper",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    borderRadius: 2,
                    minWidth: 180,
                  },
                }}
                TransitionComponent={Fade}
                transitionDuration={200}
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
                <Divider />
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

              <Tooltip title={view === "grid" ? "List view" : "Grid view"}>
                <IconButton
                  onClick={toggleView}
                  color="primary"
                  sx={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    bgcolor: "background.paper",
                    "&:hover": {
                      bgcolor: "background.paper",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {view === "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
                </IconButton>
              </Tooltip>

              <IconButton
                disabled={!hasNextFloor}
                onClick={() =>
                  navigateToFloor(allFloors[currentFloorIndex + 1].floorNumber)
                }
                aria-label="next floor"
                color="primary"
                sx={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "background.paper",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Search and Sort Controls */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              mb: 3,
            }}
          >
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 10,
                px: 2,
                py: 0.5,
                flex: { xs: "1", sm: "0.6" },
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              <InputBase
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ flex: 1 }}
              />
              {searchQuery && (
                <IconButton size="small" onClick={clearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Paper>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Tooltip
                title={`Sort by name (${
                  sortDirection === "asc" ? "A-Z" : "Z-A"
                })`}
              >
                <Button
                  variant={sortBy === "name" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleSort("name")}
                  endIcon={
                    sortBy === "name" &&
                    (sortDirection === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    ))
                  }
                  sx={{ borderRadius: 10 }}
                >
                  Name
                </Button>
              </Tooltip>
              <Tooltip
                title={`Sort by capacity (${
                  sortDirection === "asc" ? "Low to High" : "High to Low"
                })`}
              >
                <Button
                  variant={sortBy === "capacity" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleSort("capacity")}
                  endIcon={
                    sortBy === "capacity" &&
                    (sortDirection === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    ))
                  }
                  sx={{ borderRadius: 10 }}
                >
                  Capacity
                </Button>
              </Tooltip>
              <Tooltip
                title={`Sort by type (${
                  sortDirection === "asc" ? "A-Z" : "Z-A"
                })`}
              >
                <Button
                  variant={sortBy === "type" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleSort("type")}
                  endIcon={
                    sortBy === "type" &&
                    (sortDirection === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    ))
                  }
                  sx={{ borderRadius: 10 }}
                >
                  Type
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* Active Filters */}
          {filter !== "all" && (
            <Box sx={{ display: "flex", mb: 3 }}>
              <Chip
                label={`Filter: ${
                  filter === "available"
                    ? "Available"
                    : filter === "reserved"
                    ? "Reserved"
                    : filter === "small"
                    ? "Small capacity"
                    : filter === "medium"
                    ? "Medium capacity"
                    : filter === "large"
                    ? "Large capacity"
                    : "All"
                }`}
                onDelete={() => setFilter("all")}
                color="primary"
                variant="outlined"
                sx={{ borderRadius: 10 }}
              />
            </Box>
          )}

          {/* Rooms display */}
          {processedRooms.length === 0 ? (
            <Alert
              severity="info"
              sx={{
                borderRadius: 2,
                fontWeight: "medium",
                mt: 4,
              }}
            >
              No rooms match the selected criteria.
            </Alert>
          ) : view === "grid" ? (
            <Grid container spacing={3}>
              {processedRooms.map((room) => (
                <Fade in={true} key={room.id} timeout={300}>
                  <Grid item xs={12} sm={6} md={4}>
                    <RoomCard room={room} floorNumber={floorNumber} />
                  </Grid>
                </Fade>
              ))}
            </Grid>
          ) : (
            <Box sx={{ mt: 2 }}>
              {processedRooms.map((room, index) => (
                <Fade
                  in={true}
                  key={room.id}
                  timeout={300}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <Card
                    sx={{
                      mb: 2,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      height: 80,
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: "5px",
                        backgroundColor:
                          room.status === "available"
                            ? "success.main"
                            : "error.main",
                      },
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={() => navigate(`/room/${floorNumber}/${room.id}`)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        px: 3,
                      }}
                    >
                      <Box
                        sx={{
                          flex: "0 0 40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <RoomIcon color="primary" />
                      </Box>

                      <Box sx={{ flex: "1 1 auto", ml: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {room.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Capacity: {room.capacity} • {room.roomType || "Room"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: { xs: "none", sm: "flex" },
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        {room.equipments &&
                          room.equipments
                            .slice(0, 2)
                            .map((eq, i) => (
                              <Chip
                                key={i}
                                label={eq}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                        {room.equipments && room.equipments.length > 2 && (
                          <Chip
                            label={`+${room.equipments.length - 2}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      <Box sx={{ ml: 2, minWidth: 90 }}>
                        <Chip
                          size="small"
                          color={
                            room.status === "available" ? "success" : "error"
                          }
                          label={
                            room.status === "available"
                              ? "Available"
                              : "Reserved"
                          }
                        />
                      </Box>
                    </Box>
                  </Card>
                </Fade>
              ))}
            </Box>
          )}
        </Paper>
      </Slide>
    </Container>
  );
};

export default FloorMap;
