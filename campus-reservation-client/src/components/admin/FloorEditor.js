import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tabs,
  Tab,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import {
  Group as GroupIcon,
  EventAvailable as EventAvailableIcon,
  MeetingRoom as MeetingRoomIcon,
  School as SchoolIcon,
  Apartment as ApartmentIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { floorService } from "../../services/apiService";
import RoomCreation from "./RoomCreation";

const FloorEditor = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [openRoomDialog, setOpenRoomDialog] = useState(false);

  // Formulaire pour ajouter/modifier un étage
  const [floorForm, setFloorForm] = useState({
    floorNumber: "",
    name: "",
  });

  // Données de l'éditeur
  const [editorElements, setEditorElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  // Charger les données
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        setLoading(true);

        // Récupérer tous les étages
        const floorsData = await floorService.getAllFloors();
        setFloors(floorsData);

        // Sélectionner le premier étage par défaut s'il y en a
        if (floorsData.length > 0) {
          setSelectedFloor(floorsData[0]);
          setEditorElements(floorsData[0].elements || []);
        }

        setLoading(false);
      } catch (err) {
        setError(
          err.message || "Une erreur est survenue lors du chargement des étages"
        );
        setLoading(false);
      }
    };

    fetchFloors();
  }, []);

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gérer le changement d'étage sélectionné
  const handleFloorChange = (event) => {
    const floorNumber = parseInt(event.target.value);
    const floor = floors.find((f) => f.floorNumber === floorNumber);
    if (floor) {
      setSelectedFloor(floor);
      setEditorElements(floor.elements || []);
    }
  };

  // Ouvrir le dialogue d'ajout d'étage
  const handleOpenAddFloorDialog = () => {
    setDialogType("addFloor");
    setFloorForm({
      floorNumber: "",
      name: "",
    });
    setOpenDialog(true);
  };

  // Ouvrir le dialogue de modification d'étage
  const handleOpenEditFloorDialog = () => {
    if (!selectedFloor) return;

    setDialogType("editFloor");
    setFloorForm({
      floorNumber: selectedFloor.floorNumber,
      name: selectedFloor.name,
    });
    setOpenDialog(true);
  };

  // Fermer le dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Gérer les changements dans le formulaire d'étage
  const handleFloorFormChange = (e) => {
    const { name, value } = e.target;
    setFloorForm((prev) => ({
      ...prev,
      [name]: name === "floorNumber" ? parseInt(value) || "" : value,
    }));
  };

  // Ajouter un nouvel étage (simulé)
  const handleAddFloor = async () => {
    try {
      setLoading(true);

      // Valider le formulaire
      if (!floorForm.floorNumber || !floorForm.name) {
        setError("Tous les champs sont obligatoires");
        setLoading(false);
        return;
      }

      // Vérifier si l'étage existe déjà
      if (floors.some((f) => f.floorNumber === floorForm.floorNumber)) {
        setError(`L'étage ${floorForm.floorNumber} existe déjà`);
        setLoading(false);
        return;
      }

      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Créer le nouvel étage
      const newFloor = {
        ...floorForm,
        elements: [],
        _id: Date.now().toString(),
      };

      // Mettre à jour l'état
      setFloors((prev) => [...prev, newFloor]);
      setSelectedFloor(newFloor);
      setEditorElements([]);

      setLoading(false);
      handleCloseDialog();

      // Normalement, vous appelleriez votre API ici
      // const response = await floorService.createFloor(floorForm);
      // setFloors(prev => [...prev, response]);
      // setSelectedFloor(response);
    } catch (err) {
      setError(
        err.message || "Une erreur est survenue lors de la création de l'étage"
      );
      setLoading(false);
    }
  };

  // Modifier un étage existant (simulé)
  const handleUpdateFloor = async () => {
    try {
      setLoading(true);

      // Valider le formulaire
      if (!floorForm.name) {
        setError("Le nom de l'étage est obligatoire");
        setLoading(false);
        return;
      }

      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mettre à jour l'état
      setFloors((prev) =>
        prev.map((floor) =>
          floor.floorNumber === selectedFloor.floorNumber
            ? { ...floor, name: floorForm.name }
            : floor
        )
      );

      setSelectedFloor((prev) => ({ ...prev, name: floorForm.name }));

      setLoading(false);
      handleCloseDialog();

      // Normalement, vous appelleriez votre API ici
      // await floorService.updateFloor(selectedFloor.floorNumber, { name: floorForm.name });
      // const updatedFloors = await floorService.getAllFloors();
      // setFloors(updatedFloors);
    } catch (err) {
      setError(
        err.message ||
          "Une erreur est survenue lors de la modification de l'étage"
      );
      setLoading(false);
    }
  };

  // Enregistrer les modifications de l'étage (éléments)
  const handleSaveFloor = async () => {
    if (!selectedFloor) return;

    try {
      setLoading(true);

      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mettre à jour l'état localement
      setFloors((prev) =>
        prev.map((floor) =>
          floor.floorNumber === selectedFloor.floorNumber
            ? { ...floor, elements: editorElements }
            : floor
        )
      );

      setSelectedFloor((prev) => ({ ...prev, elements: editorElements }));

      setLoading(false);

      // Normalement, vous appelleriez votre API ici
      // await floorService.updateFloor(selectedFloor.floorNumber, { elements: editorElements });
    } catch (err) {
      setError(
        err.message ||
          "Une erreur est survenue lors de l'enregistrement de l'étage"
      );
      setLoading(false);
    }
  };

  // Ajouter un élément
  const handleAddElement = (type) => {
    if (!selectedFloor) return;

    const newElement = {
      id: `${type}-${Date.now()}`,
      name:
        type === "room"
          ? `Salle ${
              editorElements.filter((e) => e.type === "room").length + 1
            }`
          : type === "corridor"
          ? "Couloir"
          : "Escalier",
      type,
      status: "available",
      x: 50,
      y: 50,
      width: type === "room" ? 100 : 50,
      height: type === "room" ? 80 : 50,
      capacity: type === "room" ? 20 : null,
      equipments: type === "room" ? [] : null,
    };

    setEditorElements((prev) => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  // Handle room creation
  const handleCreateRoom = async (roomData) => {
    try {
      setLoading(true);
      await floorService.addElementToFloor(selectedFloor.floorNumber, roomData);
      // Refresh floor data
      const updatedFloor = await floorService.getFloorByNumber(selectedFloor.floorNumber);
      setSelectedFloor(updatedFloor);
      setEditorElements(updatedFloor.elements || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la création de la salle");
      setLoading(false);
    }
  };

  // Gérer le rendu des différents onglets
  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Plan d'étage
        return renderFloorPlan();
      case 1: // Éléments
        return renderElementsList();
      case 2: // Paramètres
        return renderFloorSettings();
      default:
        return null;
    }
  };

  // Rendu du plan d'étage (simplifié pour cet exemple)
  const renderFloorPlan = () => {
    if (!selectedFloor) {
      return (
        <Alert severity="info">
          Sélectionnez un étage ou créez-en un nouveau pour commencer l'édition.
        </Alert>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Plan de l'étage {selectedFloor.name} (Étage{" "}
          {selectedFloor.floorNumber})
        </Typography>
        <Alert severity="info">
          Cette section contiendrait normalement un éditeur visuel du plan
          d'étage. Vous pourriez glisser-déposer des éléments, les
          redimensionner, etc.
        </Alert>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveFloor}
            startIcon={<SaveIcon />}
            sx={{ mr: 2 }}
          >
            Enregistrer le plan
          </Button>
        </Box>
      </Box>
    );
  };

  // Rendu de la liste des éléments
  const renderElementsList = () => {
    if (!selectedFloor) {
      return (
        <Alert severity="info">
          Sélectionnez un étage pour voir ses éléments.
        </Alert>
      );
    }

    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">
            Éléments de l'étage {selectedFloor.name}
          </Typography>
          <Box>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenRoomDialog(true)}
              sx={{ mr: 1 }}
            >
              Ajouter une salle
            </Button>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleAddElement("corridor")}
              sx={{ mr: 1 }}
            >
              Ajouter un couloir
            </Button>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleAddElement("stairs")}
            >
              Ajouter un escalier
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editorElements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucun élément dans cet étage
                  </TableCell>
                </TableRow>
              ) : (
                editorElements.map((element) => (
                  <TableRow key={element.id}>
                    <TableCell>{element.id}</TableCell>
                    <TableCell>{element.name}</TableCell>
                    <TableCell>
                      {element.type === "room"
                        ? "Salle"
                        : element.type === "corridor"
                        ? "Couloir"
                        : "Escalier"}
                    </TableCell>
                    <TableCell>
                      {element.type === "room" && (
                        <Chip
                          size="small"
                          label={
                            element.status === "available"
                              ? "Disponible"
                              : "Réservée"
                          }
                          color={
                            element.status === "available" ? "success" : "error"
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      x: {element.x}, y: {element.y}, w: {element.width}, h:{" "}
                      {element.height}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveFloor}
            startIcon={<SaveIcon />}
          >
            Enregistrer les modifications
          </Button>
        </Box>
      </Box>
    );
  };

  // Rendu des paramètres de l'étage
  const renderFloorSettings = () => {
    if (!selectedFloor) {
      return (
        <Alert severity="info">
          Sélectionnez un étage pour voir ses paramètres.
        </Alert>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Paramètres de l'étage {selectedFloor.name}
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Numéro d'étage</Typography>
              <Typography variant="body1">
                {selectedFloor.floorNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Nom</Typography>
              <Typography variant="body1">{selectedFloor.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Nombre de salles</Typography>
              <Typography variant="body1">
                {
                  editorElements.filter((element) => element.type === "room")
                    .length
                }
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Date de création</Typography>
              <Typography variant="body1">
                {selectedFloor.createdAt
                  ? new Date(selectedFloor.createdAt).toLocaleDateString()
                  : "Non disponible"}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenEditFloorDialog}
              startIcon={<EditIcon />}
            >
              Modifier les informations de l'étage
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  if (loading && floors.length === 0) {
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
          Éditeur d'étages
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddFloorDialog}
        >
          Nouvel étage
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Sélectionner un étage</InputLabel>
            <Select
              value={selectedFloor?.floorNumber || ""}
              onChange={handleFloorChange}
              label="Sélectionner un étage"
            >
              {floors.map((floor) => (
                <MenuItem key={floor.floorNumber} value={floor.floorNumber}>
                  {floor.name} (Étage {floor.floorNumber})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {selectedFloor && (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Plan d'étage" />
              <Tab label="Éléments" />
              <Tab label="Paramètres" />
            </Tabs>
          </Box>
          <Box sx={{ p: 2 }}>{renderTabContent()}</Box>
        </Box>
      )}

      {/* Dialogue d'ajout d'étage */}
      <Dialog
        open={openDialog && dialogType === "addFloor"}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Ajouter un nouvel étage</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Numéro d'étage"
                name="floorNumber"
                type="number"
                value={floorForm.floorNumber}
                onChange={handleFloorFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de l'étage"
                name="name"
                value={floorForm.name}
                onChange={handleFloorFormChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleAddFloor} variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de modification d'étage */}
      <Dialog
        open={openDialog && dialogType === "editFloor"}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Modifier l'étage</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Numéro d'étage"
                name="floorNumber"
                type="number"
                value={floorForm.floorNumber}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de l'étage"
                name="name"
                value={floorForm.name}
                onChange={handleFloorFormChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={handleUpdateFloor}
            variant="contained"
            color="primary"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Room Creation Dialog */}
      <RoomCreation
        open={openRoomDialog}
        onClose={() => setOpenRoomDialog(false)}
        onSubmit={handleCreateRoom}
        floorNumber={selectedFloor?.floorNumber}
      />
    </Box>
  );
};

export default FloorEditor;
