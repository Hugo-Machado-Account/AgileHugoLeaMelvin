import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { reservationService } from "../services/apiService";

const Profile = () => {
  const navigate = useNavigate();
  const { user, getUserProfile, loading: authLoading } = useAuth();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    department: "",
    role: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stats, setStats] = useState({
    totalReservations: 0,
    upcomingReservations: 0,
  });

  // Charger les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Récupérer le profil utilisateur mis à jour
        const updatedUser = await getUserProfile();

        // Mettre à jour les données du profil
        setProfileData({
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          email: updatedUser.email || "",
          username: updatedUser.username || "",
          department: updatedUser.department || "",
          role: updatedUser.role || "student",
        });

        // Récupérer les statistiques des réservations
        const reservations = await reservationService.getMyReservations();

        // Calculer les statistiques
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = reservations.filter(
          (res) => new Date(res.date) >= today
        );

        setStats({
          totalReservations: reservations.length,
          upcomingReservations: upcoming.length,
        });

        setLoading(false);
      } catch (err) {
        setError(
          err.message || "Une erreur est survenue lors du chargement du profil"
        );
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, getUserProfile]);

  // Activer le mode édition
  const handleEditMode = () => {
    setEditMode(true);
  };

  // Désactiver le mode édition
  const handleCancelEdit = () => {
    setEditMode(false);

    // Réinitialiser les données du formulaire
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        username: user.username || "",
        department: user.department || "",
        role: user.role || "student",
      });
    }

    // Effacer les messages
    setError(null);
    setSuccess(null);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumettre le formulaire (à implémenter avec votre API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Note: Cette fonctionnalité nécessite une endpoint API pour mettre à jour le profil
    // Pour l'instant, simulons une mise à jour réussie

    try {
      setLoading(true);

      // Ici, vous devriez appeler votre API pour mettre à jour le profil
      // Exemple: await userService.updateProfile(profileData);

      // Simuler un délai de mise à jour
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Profil mis à jour avec succès");
      setEditMode(false);
      setLoading(false);

      // Mettre à jour le profil dans le contexte d'authentification
      await getUserProfile();
    } catch (err) {
      setError(
        err.message ||
          "Une erreur est survenue lors de la mise à jour du profil"
      );
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

  // Formater la date d'inscription
  const formatDate = (dateString) => {
    if (!dateString) return "Non disponible";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  if (loading || authLoading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement du profil...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Mon Profil
          </Typography>
          {!editMode ? (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditMode}
            >
              Modifier
            </Button>
          ) : (
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancelEdit}
                sx={{ mr: 1 }}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
              >
                Enregistrer
              </Button>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ my: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Informations de profil */}
          <Grid item xs={12} md={8}>
            <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Informations personnelles
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Prénom"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nom"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nom d'utilisateur"
                        name="username"
                        value={profileData.username}
                        onChange={handleChange}
                        required
                        disabled
                        helperText="Le nom d'utilisateur ne peut pas être modifié"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        required
                        disabled
                        helperText="L'adresse email ne peut pas être modifiée"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="role-label">Rôle</InputLabel>
                        <Select
                          labelId="role-label"
                          name="role"
                          value={profileData.role}
                          label="Rôle"
                          disabled
                        >
                          <MenuItem value="student">Étudiant</MenuItem>
                          <MenuItem value="teacher">Enseignant</MenuItem>
                          <MenuItem value="admin">Administrateur</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Département"
                        name="department"
                        value={profileData.department}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </form>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        <strong>Nom complet:</strong> {profileData.firstName}{" "}
                        {profileData.lastName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <BadgeIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        <strong>Nom d'utilisateur:</strong>{" "}
                        {profileData.username}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        <strong>Email:</strong> {profileData.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        <strong>Rôle:</strong>{" "}
                        {getRoleDisplay(profileData.role)}
                      </Typography>
                    </Box>
                    {profileData.department && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body1">
                          <strong>Département:</strong> {profileData.department}
                        </Typography>
                      </Box>
                    )}
                    {user?.createdAt && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <CalendarTodayIcon
                          sx={{ mr: 1, color: "primary.main" }}
                        />
                        <Typography variant="body1">
                          <strong>Membre depuis:</strong>{" "}
                          {formatDate(user.createdAt)}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Statistiques et Avatar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    bgcolor: "primary.main",
                  }}
                >
                  {profileData.firstName && profileData.lastName ? (
                    `${profileData.firstName[0]}${profileData.lastName[0]}`
                  ) : (
                    <PersonIcon fontSize="large" />
                  )}
                </Avatar>
                <Typography variant="h6" align="center">
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Chip
                  label={getRoleDisplay(profileData.role)}
                  color={
                    profileData.role === "admin"
                      ? "error"
                      : profileData.role === "teacher"
                      ? "primary"
                      : "default"
                  }
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Total des réservations:</strong>{" "}
                  {stats.totalReservations}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Réservations à venir:</strong>{" "}
                  {stats.upcomingReservations}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => navigate("/my-reservations")}
                >
                  Voir mes réservations
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
