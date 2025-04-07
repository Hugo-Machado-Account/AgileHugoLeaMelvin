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
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

// Note: Ce composant simule les données et les fonctionnalités car nous n'avons pas d'API réelle
// Dans une implémentation réelle, vous utiliseriez une API pour les opérations CRUD

const UsersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogType, setDialogType] = useState("");

  // Formulaire pour ajouter/modifier un utilisateur
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "student",
    department: "",
    isActive: true,
  });

  // Données simulées
  useEffect(() => {
    // Simuler un chargement de données
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Générer des utilisateurs de test
        const mockUsers = [
          {
            _id: "1",
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean.dupont@example.com",
            username: "jdupont",
            role: "admin",
            department: "Administration",
            isActive: true,
            lastLogin: new Date("2023-05-15T10:30:00"),
            createdAt: new Date("2023-01-10T08:00:00"),
          },
          {
            _id: "2",
            firstName: "Marie",
            lastName: "Martin",
            email: "marie.martin@example.com",
            username: "mmartin",
            role: "teacher",
            department: "Informatique",
            isActive: true,
            lastLogin: new Date("2023-05-10T14:20:00"),
            createdAt: new Date("2023-01-15T10:30:00"),
          },
          {
            _id: "3",
            firstName: "Pierre",
            lastName: "Dubois",
            email: "pierre.dubois@example.com",
            username: "pdubois",
            role: "student",
            department: "Informatique",
            isActive: true,
            lastLogin: new Date("2023-05-12T09:45:00"),
            createdAt: new Date("2023-02-01T11:15:00"),
          },
          {
            _id: "4",
            firstName: "Sophie",
            lastName: "Leroy",
            email: "sophie.leroy@example.com",
            username: "sleroy",
            role: "student",
            department: "Mathématiques",
            isActive: false,
            lastLogin: new Date("2023-04-01T16:30:00"),
            createdAt: new Date("2023-01-20T13:45:00"),
          },
          {
            _id: "5",
            firstName: "Thomas",
            lastName: "Moreau",
            email: "thomas.moreau@example.com",
            username: "tmoreau",
            role: "teacher",
            department: "Physique",
            isActive: true,
            lastLogin: new Date("2023-05-14T11:10:00"),
            createdAt: new Date("2023-01-25T09:20:00"),
          },
        ];

        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des utilisateurs");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrer les utilisateurs en fonction de la recherche
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }

    setPage(0);
  }, [searchQuery, users]);

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

  // Ouvrir le dialogue d'ajout d'utilisateur
  const handleOpenAddDialog = () => {
    setDialogType("add");
    setUserForm({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      role: "student",
      department: "",
      isActive: true,
    });
    setOpenDialog(true);
  };

  // Ouvrir le dialogue de modification d'utilisateur
  const handleOpenEditDialog = (user) => {
    setDialogType("edit");
    setSelectedUser(user);
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department || "",
      isActive: user.isActive,
    });
    setOpenDialog(true);
  };

  // Ouvrir le dialogue de suppression d'utilisateur
  const handleOpenDeleteDialog = (user) => {
    setDialogType("delete");
    setSelectedUser(user);
    setOpenDialog(true);
  };

  // Ouvrir le dialogue de blocage/déblocage d'utilisateur
  const handleOpenToggleActiveDialog = (user) => {
    setDialogType("toggleActive");
    setSelectedUser(user);
    setOpenDialog(true);
  };

  // Fermer le dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  // Gérer les changements dans le formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumettre le formulaire (simulé)
  const handleSubmitForm = async () => {
    try {
      setLoading(true);

      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (dialogType === "add") {
        // Simuler l'ajout d'un utilisateur
        const newUser = {
          _id: Date.now().toString(),
          ...userForm,
          lastLogin: null,
          createdAt: new Date(),
        };

        setUsers((prev) => [...prev, newUser]);
      } else if (dialogType === "edit" && selectedUser) {
        // Simuler la modification d'un utilisateur
        setUsers((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  ...userForm,
                }
              : user
          )
        );
      } else if (dialogType === "delete" && selectedUser) {
        // Simuler la suppression d'un utilisateur
        setUsers((prev) =>
          prev.filter((user) => user._id !== selectedUser._id)
        );
      } else if (dialogType === "toggleActive" && selectedUser) {
        // Simuler le blocage/déblocage d'un utilisateur
        setUsers((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  isActive: !user.isActive,
                }
              : user
          )
        );
      }

      setLoading(false);
      handleCloseDialog();
    } catch (err) {
      setError("Erreur lors de l'opération");
      setLoading(false);
    }
  };

  // Déterminer le rôle affiché
  const getRoleDisplay = (role) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "teacher":
        return "Enseignant";
      case "student":
      default:
        return "Étudiant";
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Jamais";

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Afficher le dialogue approprié
  const renderDialog = () => {
    switch (dialogType) {
      case "add":
        return (
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  margin="dense"
                  name="firstName"
                  label="Prénom"
                  fullWidth
                  value={userForm.firstName}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  margin="dense"
                  name="lastName"
                  label="Nom"
                  fullWidth
                  value={userForm.lastName}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={userForm.email}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  margin="dense"
                  name="username"
                  label="Nom d'utilisateur"
                  fullWidth
                  value={userForm.username}
                  onChange={handleFormChange}
                  required
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Rôle</InputLabel>
                  <Select
                    name="role"
                    value={userForm.role}
                    onChange={handleFormChange}
                    label="Rôle"
                  >
                    <MenuItem value="student">Étudiant</MenuItem>
                    <MenuItem value="teacher">Enseignant</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  name="department"
                  label="Département"
                  fullWidth
                  value={userForm.department}
                  onChange={handleFormChange}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button
                onClick={handleSubmitForm}
                variant="contained"
                color="primary"
              >
                Ajouter
              </Button>
            </DialogActions>
          </Dialog>
        );

      case "edit":
        return (
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  margin="dense"
                  name="firstName"
                  label="Prénom"
                  fullWidth
                  value={userForm.firstName}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  margin="dense"
                  name="lastName"
                  label="Nom"
                  fullWidth
                  value={userForm.lastName}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={userForm.email}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  margin="dense"
                  name="username"
                  label="Nom d'utilisateur"
                  fullWidth
                  value={userForm.username}
                  onChange={handleFormChange}
                  disabled
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Rôle</InputLabel>
                  <Select
                    name="role"
                    value={userForm.role}
                    onChange={handleFormChange}
                    label="Rôle"
                  >
                    <MenuItem value="student">Étudiant</MenuItem>
                    <MenuItem value="teacher">Enseignant</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  name="department"
                  label="Département"
                  fullWidth
                  value={userForm.department}
                  onChange={handleFormChange}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button
                onClick={handleSubmitForm}
                variant="contained"
                color="primary"
              >
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
        );

      case "delete":
        return (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                {selectedUser?.firstName} {selectedUser?.lastName} ? Cette
                action est irréversible.
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

      case "toggleActive":
        return (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              {selectedUser?.isActive
                ? "Bloquer l'utilisateur"
                : "Débloquer l'utilisateur"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {selectedUser?.isActive
                  ? `Êtes-vous sûr de vouloir bloquer l'accès de ${selectedUser?.firstName} ${selectedUser?.lastName} ?`
                  : `Êtes-vous sûr de vouloir débloquer l'accès de ${selectedUser?.firstName} ${selectedUser?.lastName} ?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button
                onClick={handleSubmitForm}
                variant="contained"
                color={selectedUser?.isActive ? "warning" : "success"}
              >
                {selectedUser?.isActive ? "Bloquer" : "Débloquer"}
              </Button>
            </DialogActions>
          </Dialog>
        );

      default:
        return null;
    }
  };

  if (loading && users.length === 0) {
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
          Gestion des utilisateurs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Nouvel utilisateur
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher un utilisateur..."
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
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Dernière connexion</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleDisplay(user.role)}
                      color={
                        user.role === "admin"
                          ? "error"
                          : user.role === "teacher"
                          ? "primary"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.department || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? "Actif" : "Bloqué"}
                      color={user.isActive ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEditDialog(user)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color={user.isActive ? "warning" : "success"}
                      onClick={() => handleOpenToggleActiveDialog(user)}
                      sx={{ mr: 1 }}
                    >
                      {user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
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

export default UsersList;
