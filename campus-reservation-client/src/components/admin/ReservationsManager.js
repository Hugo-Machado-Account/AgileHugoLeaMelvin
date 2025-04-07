import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import frLocale from "date-fns/locale/fr";
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import { reservationService, floorService } from "../../services/apiService";

const ReservationsManager = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(null);
  const [floorFilter, setFloorFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [dialogType, setDialogType] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer tous les étages et salles
        const floorsData = await floorService.getAllFloors();
        setFloors(floorsData);

        // Extraire toutes les salles
        const allRooms = [];
        floorsData.forEach((floor) => {
          const floorRooms = floor.elements
            .filter((element) => element.type === "room")
            .map((room) => ({
              ...room,
              floorNumber: floor.floorNumber,
              floorName: floor.name,
            }));

          allRooms.push(...floorRooms);
        });

        setRooms(allRooms);

        // Récupérer toutes les réservations
        const reservationsData = await reservationService.getAllReservations();

        // Enrichir les données des réservations avec les infos de salle
        const enrichedReservations = reservationsData.map((reservation) => {
          const room = allRooms.find((r) => r.id === reservation.roomId);
          return {
            ...reservation,
            roomName: room?.name || "Salle inconnue",
            floorName: room?.floorName || `Étage ${reservation.floorNumber}`,
          };
        });

        setReservations(enrichedReservations);
        setFilteredReservations(enrichedReservations);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...reservations];

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reservation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reservation.purpose
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          reservation.roomName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          reservation.floorName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filtrer par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.status === statusFilter
      );
    }

    // Filtrer par date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter((reservation) => {
        const reservationDate = new Date(reservation.date);
        reservationDate.setHours(0, 0, 0, 0);
        return reservationDate.getTime() === filterDate.getTime();
      });
    }

    // Filtrer par étage
    if (floorFilter) {
      filtered = filtered.filter(
        (reservation) => reservation.floorNumber.toString() === floorFilter
      );
    }

    // Filtrer par salle
    if (roomFilter) {
      filtered = filtered.filter(
        (reservation) => reservation.roomId === roomFilter
      );
    }

    // Appliquer le filtre par onglet (à venir / passées)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (tabValue === 0) {
      // À venir
      filtered = filtered.filter((reservation) => {
        const reservationDate = new Date(reservation.date);
        reservationDate.setHours(0, 0, 0, 0);
        return reservationDate >= today;
      });
    } else if (tabValue === 1) {
      // Passées
      filtered = filtered.filter((reservation) => {
        const reservationDate = new Date(reservation.date);
        reservationDate.setHours(0, 0, 0, 0);
        return reservationDate < today;
      });
    }

    // Trier les réservations par date et heure
    filtered.sort((a, b) => {
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) return dateComparison;
      return a.startTime.localeCompare(b.startTime);
    });

    setFilteredReservations(filtered);
    setPage(0);
  }, [
    searchQuery,
    statusFilter,
    dateFilter,
    floorFilter,
    roomFilter,
    reservations,
    tabValue,
  ]);

  // Gérer la pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gérer la recherche
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Gérer les filtres
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleDateFilterChange = (date) => {
    setDateFilter(date);
  };

  const handleFloorFilterChange = (event) => {
    setFloorFilter(event.target.value);
    setRoomFilter(""); // Réinitialiser le filtre de salle
  };

  const handleRoomFilterChange = (event) => {
    setRoomFilter(event.target.value);
  };

  // Gérer les onglets
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter(null);
    setFloorFilter("");
    setRoomFilter("");
  };

  // Ouvrir le dialogue de détails
  const handleOpenDetailsDialog = (reservation) => {
    setDialogType("details");
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  // Ouvrir le dialogue de suppression
  const handleOpenDeleteDialog = (reservation) => {
    setDialogType("delete");
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  // Ouvrir le dialogue de changement de statut
  const handleOpenStatusDialog = (reservation, newStatus) => {
    setDialogType("status");
    setSelectedReservation({
      ...reservation,
      newStatus,
    });
    setOpenDialog(true);
  };

  // Fermer le dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReservation(null);
  };

  // Soumettre l'action (simulé)
  const handleSubmitAction = async () => {
    try {
      setLoading(true);

      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (dialogType === "delete" && selectedReservation) {
        // Simuler la suppression
        setReservations((prev) =>
          prev.filter((r) => r._id !== selectedReservation._id)
        );

        // Normalement, vous appelleriez l'API
        // await reservationService.deleteReservation(selectedReservation._id);
      } else if (dialogType === "status" && selectedReservation) {
        // Simuler le changement de statut
        setReservations((prev) =>
          prev.map((r) =>
            r._id === selectedReservation._id
              ? { ...r, status: selectedReservation.newStatus }
              : r
          )
        );

        // Normalement, vous appelleriez l'API
        // await reservationService.updateReservation(selectedReservation._id, { status: selectedReservation.newStatus });
      }

      setLoading(false);
      handleCloseDialog();
    } catch (err) {
      setError("Erreur lors de l'opération");
      setLoading(false);
    }
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

  // Rendre le dialogue approprié
  const renderDialog = () => {
    switch (dialogType) {
      case "details":
        return (
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Détails de la réservation</DialogTitle>
            <DialogContent>
              {selectedReservation && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Salle</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedReservation.roomName} (Étage{" "}
                      {selectedReservation.floorNumber})
                    </Typography>

                    <Typography variant="subtitle1">Date</Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(selectedReservation.date)}
                    </Typography>

                    <Typography variant="subtitle1">Horaires</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedReservation.startTime} -{" "}
                      {selectedReservation.endTime}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Réservé par</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedReservation.name}
                    </Typography>

                    <Typography variant="subtitle1">Email</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedReservation.email}
                    </Typography>

                    <Typography variant="subtitle1">Statut</Typography>
                    <Chip
                      label={
                        selectedReservation.status === "confirmed"
                          ? "Confirmée"
                          : selectedReservation.status === "pending"
                          ? "En attente"
                          : "Annulée"
                      }
                      color={
                        selectedReservation.status === "confirmed"
                          ? "success"
                          : selectedReservation.status === "pending"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Objet</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedReservation.purpose}
                    </Typography>

                    {selectedReservation.notes && (
                      <>
                        <Typography variant="subtitle1">Notes</Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedReservation.notes}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Fermer</Button>
            </DialogActions>
          </Dialog>
        );

      case "delete":
        return (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Supprimer la réservation</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Êtes-vous sûr de vouloir supprimer cette réservation ?
                {selectedReservation && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Salle:</strong> {selectedReservation.roomName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong>{" "}
                      {formatDate(selectedReservation.date)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Horaires:</strong> {selectedReservation.startTime}{" "}
                      - {selectedReservation.endTime}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Réservé par:</strong> {selectedReservation.name}
                    </Typography>
                  </Box>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button
                onClick={handleSubmitAction}
                color="error"
                variant="contained"
              >
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        );

      case "status":
        return (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              {selectedReservation?.newStatus === "confirmed"
                ? "Confirmer la réservation"
                : "Annuler la réservation"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {selectedReservation?.newStatus === "confirmed"
                  ? "Êtes-vous sûr de vouloir confirmer cette réservation ?"
                  : "Êtes-vous sûr de vouloir annuler cette réservation ?"}
                {selectedReservation && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Salle:</strong> {selectedReservation.roomName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong>{" "}
                      {formatDate(selectedReservation.date)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Horaires:</strong> {selectedReservation.startTime}{" "}
                      - {selectedReservation.endTime}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Réservé par:</strong> {selectedReservation.name}
                    </Typography>
                  </Box>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button
                onClick={handleSubmitAction}
                color={
                  selectedReservation?.newStatus === "confirmed"
                    ? "success"
                    : "error"
                }
                variant="contained"
              >
                {selectedReservation?.newStatus === "confirmed"
                  ? "Confirmer"
                  : "Annuler la réservation"}
              </Button>
            </DialogActions>
          </Dialog>
        );

      default:
        return null;
    }
  };

  if (loading && reservations.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Gestion des réservations
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Réservations à venir" />
          <Tab label="Réservations passées" />
          <Tab label="Toutes les réservations" />
        </Tabs>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Statut"
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="confirmed">Confirmées</MenuItem>
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="cancelled">Annulées</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={frLocale}
            >
              <DatePicker
                label="Date"
                value={dateFilter}
                onChange={handleDateFilterChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                clearable
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Étage</InputLabel>
              <Select
                value={floorFilter}
                onChange={handleFloorFilterChange}
                label="Étage"
              >
                <MenuItem value="">Tous</MenuItem>
                {floors.map((floor) => (
                  <MenuItem
                    key={floor.floorNumber}
                    value={floor.floorNumber.toString()}
                  >
                    {floor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth disabled={!floorFilter}>
              <InputLabel>Salle</InputLabel>
              <Select
                value={roomFilter}
                onChange={handleRoomFilterChange}
                label="Salle"
              >
                <MenuItem value="">Toutes</MenuItem>
                {rooms
                  .filter(
                    (room) =>
                      !floorFilter ||
                      room.floorNumber.toString() === floorFilter
                  )
                  .map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button onClick={handleResetFilters} variant="outlined">
              Réinitialiser les filtres
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Horaires</TableCell>
              <TableCell>Salle</TableCell>
              <TableCell>Demandeur</TableCell>
              <TableCell>Objet</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((reservation) => (
                <TableRow key={reservation._id}>
                  <TableCell>{formatDate(reservation.date)}</TableCell>
                  <TableCell>
                    {reservation.startTime} - {reservation.endTime}
                  </TableCell>
                  <TableCell>
                    {reservation.roomName}
                    <Typography variant="body2" color="text.secondary">
                      {reservation.floorName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {reservation.name}
                    <Typography variant="body2" color="text.secondary">
                      {reservation.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={reservation.purpose}>
                      <Typography
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {reservation.purpose}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        reservation.status === "confirmed"
                          ? "Confirmée"
                          : reservation.status === "pending"
                          ? "En attente"
                          : "Annulée"
                      }
                      color={
                        reservation.status === "confirmed"
                          ? "success"
                          : reservation.status === "pending"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDetailsDialog(reservation)}
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      {reservation.status !== "confirmed" && (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() =>
                            handleOpenStatusDialog(reservation, "confirmed")
                          }
                          sx={{ mr: 1 }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}

                      {reservation.status !== "cancelled" && (
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() =>
                            handleOpenStatusDialog(reservation, "cancelled")
                          }
                          sx={{ mr: 1 }}
                        >
                          <CancelIcon />
                        </IconButton>
                      )}

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(reservation)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredReservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucune réservation trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReservations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count}`
          }
        />
      </TableContainer>

      {renderDialog()}
    </Box>
  );
};

export default ReservationsManager;
