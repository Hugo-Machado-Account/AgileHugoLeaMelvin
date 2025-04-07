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
  Autocomplete,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Room as RoomIcon,
  MeetingRoom as MeetingRoomIcon,
} from "@mui/icons-material";
import { floorService } from "../../services/apiService";

const RoomManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dialogType, setDialogType] = useState("");

  // Formulaire pour ajouter/modifier une salle
  const [roomForm, setRoomForm] = useState({
    name: "",
    type: "room",
    status: "available",
    capacity: 0,
    equipments: [],
    roomType: "",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  // Options disponibles
  const roomTypes = [
    "Amphithéâtre",
    "Salle de TD",
    "Laboratoire",
    "Salle informatique",
    "Bureau",
    "Salle de réunion",
  ];
  const equipmentOptions = [
    "Vidéoprojecteur",
    "Tableau blanc",
    "Tableau noir",
    "PC",
    "TV",
    "WiFi",
    "Système de son",
    "Climatisation",
    "Tableau interactif",
    "Imprimante",
  ];

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer tous les étages
        const floorsData = await floorService.getAllFloors();
        setFloors(floorsData);

        // Extraire toutes les salles de tous les étages
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
        setFilteredRooms(allRooms);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les salles en fonction de la recherche et du filtre d'étage
  useEffect(() => {
    let filtered = [...rooms];

    // Filtrer par étage sélectionné
    if (selectedFloor) {
      filtered = filtered.filter((room) => room.floorNumber === selectedFloor);
    }

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.roomType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (room.equipments &&
            room.equipments.some((eq) =>
              eq.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
    }

    setFilteredRooms(filtered);
    setPage(0);
  }, [searchQuery, selectedFloor, rooms]);

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

  // Gérer le changement d'étage
  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value);
  };

  // Ouvrir le dialogue d'ajout de salle
  const handleOpenAddDialog = () => {
    setDialogType("add");
    setRoomForm({
      name: "",
      type: "room",
      status: "available",
      capacity: 0,
      equipments: [],
      roomType: "",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    setOpenDialog(true);
  };

  // Ouvrir le dialogue de modification de salle
  const handleOpenEditDialog = (room) => {
    setDialogType("edit");
    setSelectedRoom(room);
    setRoomForm({
      name: room.name,
      type: room.type,
      status: room.status,
      capacity: room.capacity || 0,
      equipments: room.equipments || [],
      roomType: room.roomType || "",
      x: room.x || 0,
      y: room.y || 0,
      width: room.width || 100,
      height: room.height || 100,
    });
    setOpenDialog(true);
  };

  // Ouvrir le dialogue de suppression de salle
  const handleOpenDeleteDialog = (room) => {
    setDialogType("delete");
    setSelectedRoom(room);
    setOpenDialog(true);
  };

  // Fermer le dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
  };

  // Gérer les changements dans le formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRoomForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gérer le changement des équipements (autocomplete)
  const handleEquipmentsChange = (event, newValue) => {
    setRoomForm((prev) => ({
      ...prev,
      equipments: newValue,
    }));
  };

  // Soumettre le formulaire (simulé)
  const handleSubmitForm = async () => {
    try {
      setLoading(true);

      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Ici, vous implémenteriez l'appel API réel pour modifier/ajouter/supprimer la salle
      // Pour l'instant, simplifions avec une simulation

      if (dialogType === "add") {
        // Créer un nouvel élément de salle
        const newRoom = {
          ...roomForm,
          id: `room-${Date.now()}`,
          floorNumber: selectedFloor || 1, // Par défaut étage 1 si aucun sélectionné
          floorName:
            floors.find((f) => f.floorNumber === (selectedFloor || 1))?.name ||
            "Étage 1",
        };

        // Ajouter à la liste des salles (simulé)
        setRooms((prev) => [...prev, newRoom]);

        // Normalement, vous appelleriez l'API pour ajouter cet élément à l'étage correspondant
        // await floorService.addElementToFloor(selectedFloor || 1, { ...roomForm, id: `room-${Date.now()}` });
      } else if (dialogType === "edit" && selectedRoom) {
        // Mettre à jour une salle existante
        setRooms((prev) =>
          prev.map((room) =>
            room.id === selectedRoom.id &&
            room.floorNumber === selectedRoom.floorNumber
              ? { ...room, ...roomForm }
              : room
          )
        );

        // Normalement, vous appelleriez l'API pour mettre à jour cet élément
        // await floorService.updateElement(selectedRoom.floorNumber, selectedRoom.id, roomForm);
      } else if (dialogType === "delete" && selectedRoom) {
        // Supprimer une salle
        setRooms((prev) =>
          prev.filter(
            (room) =>
              !(
                room.id === selectedRoom.id &&
                room.floorNumber === selectedRoom.floorNumber
              )
          )
        );

        // Normalement, vous appelleriez l'API pour supprimer cet élément
        // await floorService.deleteElement(selectedRoom.floorNumber, selectedRoom.id);
      }

      setLoading(false);
      handleCloseDialog();
    } catch (err) {
      setError("Erreur lors de l'opération");
      setLoading(false);
    }
  };

  // Rendre le dialogue approprié
  const renderDialog = () => {
    switch (dialogType) {
      case "add":
      case "edit":
        return (
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {dialogType === "add" ? "Ajouter une salle" : "Modifier la salle"}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom de la salle"
                    name="name"
                    value={roomForm.name}
                    onChange={handleFormChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Capacité"
                    name="capacity"
                    type="number"
                    value={roomForm.capacity}
                    onChange={handleFormChange}
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type de salle</InputLabel>
                    <Select
                      name="roomType"
                      value={roomForm.roomType}
                      onChange={handleFormChange}
                      label="Type de salle"
                    >
                      <MenuItem value="">Non spécifié</MenuItem>
                      {roomTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Statut</InputLabel>
                    <Select
                      name="status"
                      value={roomForm.status}
                      onChange={handleFormChange}
                      label="Statut"
                    >
                      <MenuItem value="available">Disponible</MenuItem>
                      <MenuItem value="reserved">Réservée</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={equipmentOptions}
                    value={roomForm.equipments}
                    onChange={handleEquipmentsChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Équipements"
                        placeholder="Sélectionner des équipements"
                      />
                    )}
                  />
                </Grid>

                {dialogType === "add" && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Étage</InputLabel>
                      <Select
                        value={selectedFloor || ""}
                        onChange={handleFloorChange}
                        label="Étage"
                      >
                        {floors.map((floor) => (
                          <MenuItem
                            key={floor.floorNumber}
                            value={floor.floorNumber}
                          >
                            {floor.name} (Étage {floor.floorNumber})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Position et dimensions (valeurs en pixels pour le plan
                    d'étage)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        label="Position X"
                        name="x"
                        type="number"
                        value={roomForm.x}
                        onChange={handleFormChange}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        label="Position Y"
                        name="y"
                        type="number"
                        value={roomForm.y}
                        onChange={handleFormChange}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        label="Largeur"
                        name="width"
                        type="number"
                        value={roomForm.width}
                        onChange={handleFormChange}
                        InputProps={{
                          inputProps: { min: 10 },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        label="Hauteur"
                        name="height"
                        type="number"
                        value={roomForm.height}
                        onChange={handleFormChange}
                        InputProps={{
                          inputProps: { min: 10 },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button
                onClick={handleSubmitForm}
                variant="contained"
                color="primary"
              >
                {dialogType === "add" ? "Ajouter" : "Enregistrer"}
              </Button>
            </DialogActions>
          </Dialog>
        );

      case "delete":
        return (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Supprimer la salle</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Êtes-vous sûr de vouloir supprimer la salle {selectedRoom?.name}{" "}
                de l'étage {selectedRoom?.floorName} ? Cette action est
                irréversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button
                onClick={handleSubmitForm}
                variant="contained"
                color="error"
              >
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        );

      default:
        return null;
    }
  };

  if (loading && rooms.length === 0) {
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
          Gestion des salles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Nouvelle salle
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Rechercher une salle..."
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
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filtrer par étage</InputLabel>
            <Select
              value={selectedFloor || ""}
              onChange={handleFloorChange}
              label="Filtrer par étage"
            >
              <MenuItem value="">Tous les étages</MenuItem>
              {floors.map((floor) => (
                <MenuItem key={floor.floorNumber} value={floor.floorNumber}>
                  {floor.name} (Étage {floor.floorNumber})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Étage</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Capacité</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Équipements</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((room) => (
                <TableRow key={`${room.floorNumber}-${room.id}`}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>
                    {room.floorName} (Étage {room.floorNumber})
                  </TableCell>
                  <TableCell>{room.roomType || "-"}</TableCell>
                  <TableCell>{room.capacity || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        room.status === "available" ? "Disponible" : "Réservée"
                      }
                      color={room.status === "available" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {room.equipments && room.equipments.length > 0
                        ? room.equipments.map((equipment, index) => (
                            <Chip
                              key={index}
                              label={equipment}
                              size="small"
                              variant="outlined"
                            />
                          ))
                        : "-"}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEditDialog(room)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(room)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredRooms.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucune salle trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRooms.length}
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

export default RoomManagement;
