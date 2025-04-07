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
  Tabs,
  Tab,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  useTheme,
  Badge,
  Fade,
  LinearProgress,
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
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  DoNotDisturb as DoNotDisturbIcon,
  DarkMode as DarkModeIcon,
  ColorLens as ColorLensIcon,
  PersonPin as PersonPinIcon,
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  Room as RoomIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { reservationService } from "../services/apiService";

// Palette de couleurs pour la personnalisation du profil
const profileColors = [
  "#2196f3", // Bleu (par défaut)
  "#f44336", // Rouge
  "#4caf50", // Vert
  "#ff9800", // Orange
  "#9c27b0", // Violet
  "#00bcd4", // Cyan
  "#607d8b", // Bleu-gris
];

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, getUserProfile } = useAuth();

  // États
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    department: "",
    role: "",
    bio: "Aucune biographie renseignée.",
    preferredColor: profileColors[0],
    notifications: true,
    darkMode: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [stats, setStats] = useState({
    totalReservations: 0,
    upcomingReservations: 0,
    cancelledReservations: 0,
    mostUsedRoom: "N/A",
    mostFrequentDay: "N/A",
    reservationsThisMonth: 0,
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  // Simulons une photo de profil (ici, on utilise une couleur aléatoire)
  const [profilePhotoColor] = useState(
    profileColors[Math.floor(Math.random() * profileColors.length)]
  );

  // Charger les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Si nous avons un utilisateur réel, essayons de récupérer son profil
        let updatedUser = user;
        try {
          if (getUserProfile) {
            updatedUser = await getUserProfile();
          }
        } catch (profileError) {
          console.warn(
            "Impossible de récupérer le profil complet:",
            profileError
          );
        }

        // Mettre à jour les données du profil avec les données de l'utilisateur
        setProfileData({
          firstName: updatedUser?.firstName || "",
          lastName: updatedUser?.lastName || "",
          email: updatedUser?.email || "",
          username: updatedUser?.username || "",
          department: updatedUser?.department || "",
          role: updatedUser?.role || "student",
          bio: updatedUser?.bio || "Aucune biographie renseignée.",
          preferredColor: updatedUser?.preferredColor || profileColors[0],
          notifications: updatedUser?.notifications !== false,
          darkMode: updatedUser?.darkMode || false,
        });

        // Récupérer les statistiques des réservations si le service est disponible
        let reservations = [];
        try {
          if (reservationService && reservationService.getMyReservations) {
            reservations = await reservationService.getMyReservations();
          } else {
            // Données simulées si le service n'est pas disponible
            reservations = [
              {
                _id: "1",
                date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // Dans 2 jours
                roomId: "Room 101",
                floorNumber: 1,
                startTime: "10:00",
                endTime: "12:00",
                status: "confirmed",
              },
              {
                _id: "2",
                date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // Dans 5 jours
                roomId: "Room 203",
                floorNumber: 2,
                startTime: "14:00",
                endTime: "16:00",
                status: "confirmed",
              },
              {
                _id: "3",
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // Il y a 3 jours
                roomId: "Room 102",
                floorNumber: 1,
                startTime: "09:00",
                endTime: "10:00",
                status: "cancelled",
              },
            ];
          }
        } catch (reservationsError) {
          console.warn(
            "Impossible de récupérer les réservations:",
            reservationsError
          );
        }

        // Analyser les données pour obtenir des statistiques
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = reservations.filter(
          (res) => new Date(res.date) >= today
        );

        const cancelled = reservations.filter(
          (res) => res.status === "cancelled"
        );

        // Analyser les statistiques avancées
        const roomCounts = {};
        const daysCounts = {};
        const thisMonth = today.getMonth();
        const thisMonthReservations = reservations.filter((res) => {
          const resDate = new Date(res.date);
          return resDate.getMonth() === thisMonth;
        });

        // Compter les réservations par salle et par jour
        reservations.forEach((res) => {
          // Compter par salle
          const roomId = res.roomId || "Non spécifié";
          roomCounts[roomId] = (roomCounts[roomId] || 0) + 1;

          // Compter par jour de la semaine
          try {
            const dayOfWeek = new Date(res.date).toLocaleString("fr-FR", {
              weekday: "long",
            });
            daysCounts[dayOfWeek] = (daysCounts[dayOfWeek] || 0) + 1;
          } catch (error) {
            console.warn("Erreur lors du calcul des jours:", error);
          }
        });

        // Trouver la salle la plus utilisée
        let mostUsedRoom = "N/A";
        let maxCount = 0;
        Object.entries(roomCounts).forEach(([room, count]) => {
          if (count > maxCount) {
            mostUsedRoom = room;
            maxCount = count;
          }
        });

        // Trouver le jour le plus fréquent
        let mostFrequentDay = "N/A";
        maxCount = 0;
        Object.entries(daysCounts).forEach(([day, count]) => {
          if (count > maxCount) {
            mostFrequentDay = day;
            maxCount = count;
          }
        });

        // Définir les statistiques
        setStats({
          totalReservations: reservations.length,
          upcomingReservations: upcoming.length,
          cancelledReservations: cancelled.length,
          mostUsedRoom,
          mostFrequentDay,
          reservationsThisMonth: thisMonthReservations.length,
        });

        // Créer une activité récente simulée
        setRecentActivity([
          {
            type: "reservation_created",
            date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 heures avant
            room: "Salle 101",
            status: "confirmed",
          },
          {
            type: "profile_updated",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 jours avant
          },
          {
            type: "reservation_cancelled",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 jours avant
            room: "Salle 203",
          },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(
          err.message || "Une erreur est survenue lors du chargement du profil"
        );
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, getUserProfile]);

  // Activer le mode édition
  const handleEditMode = () => {
    setEditMode(true);
    // Passer automatiquement à l'onglet d'édition
    setActiveTab(3);
  };

  // Désactiver le mode édition
  const handleCancelEdit = () => {
    setEditMode(false);
    setShowPasswordForm(false);
    setError(null);
    setSuccess(null);
    // Revenir à l'onglet précédent (généralement statistiques)
    setActiveTab(0);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gérer les interrupteurs
  const handleSwitchChange = (name) => (event) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: event.target.checked,
    }));
  };

  // Gérer les changements dans le formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Gérer la couleur préférée
  const handleColorChange = (color) => {
    setProfileData((prev) => ({
      ...prev,
      preferredColor: color,
    }));
  };

  // Simuler le téléchargement d'une photo
  const handlePhotoUpload = () => {
    setUploadingPhoto(true);

    // Simulation d'un téléchargement
    setTimeout(() => {
      setUploadingPhoto(false);
      setSuccess("Photo de profil mise à jour avec succès");

      // Effacer le message après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1500);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Ici, vous appelleriez votre API pour mettre à jour le profil
      // Exemple:
      // await fetch('/api/users/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(profileData)
      // });

      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Profil mis à jour avec succès");
      setSaving(false);
      setEditMode(false);

      // Retour à l'onglet statistiques
      setActiveTab(0);

      // Effacer le message après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Une erreur est survenue lors de la mise à jour du profil"
      );
      setSaving(false);
    }
  };

  // Soumettre le changement de mot de passe
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Ici, vous appelleriez votre API pour changer le mot de passe
      // Exemple:
      // await fetch('/api/users/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(passwordData)
      // });

      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Mot de passe mis à jour avec succès");
      setSaving(false);
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Effacer le message après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Une erreur est survenue lors du changement de mot de passe"
      );
      setSaving(false);
    }
  };

  // Formater la date d'inscription
  const formatDate = (dateString) => {
    if (!dateString) return "Non disponible";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
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

  // Récupérer les initiales de l'utilisateur
  const getInitials = () => {
    return profileData.firstName && profileData.lastName
      ? `${profileData.firstName[0]}${profileData.lastName[0]}`
      : user?.username?.[0] || "?";
  };

  // Formater la date pour l'activité récente
  const formatActivityDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    }
  };

  // Obtenir l'icône pour l'activité récente
  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case "reservation_created":
        return <EventAvailableIcon color="success" />;
      case "reservation_cancelled":
        return <EventBusyIcon color="error" />;
      case "profile_updated":
        return <PersonIcon color="primary" />;
      default:
        return <HistoryIcon />;
    }
  };

  // Obtenir le texte pour l'activité récente
  const getActivityText = (activity) => {
    switch (activity.type) {
      case "reservation_created":
        return `Réservation créée pour ${activity.room}`;
      case "reservation_cancelled":
        return `Réservation annulée pour ${activity.room}`;
      case "profile_updated":
        return `Profil mis à jour`;
      default:
        return "Activité inconnue";
    }
  };

  // Calculer le pourcentage d'achèvement du profil
  const calculateProfileCompletion = () => {
    let total = 0;
    let filled = 0;

    // Compter les champs remplis
    const fields = [
      "firstName",
      "lastName",
      "email",
      "username",
      "department",
      "role",
      "bio",
    ];

    fields.forEach((field) => {
      total++;
      if (
        profileData[field] &&
        profileData[field] !== "N/A" &&
        profileData[field] !== "Aucune biographie renseignée."
      ) {
        filled++;
      }
    });

    return Math.round((filled / total) * 100);
  };

  if (loading && !user) {
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
      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </Fade>
      )}

      {success && (
        <Fade in={!!success}>
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        </Fade>
      )}

      <Grid container spacing={4}>
        {/* Section gauche - Photo et informations personnelles */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderTop: `4px solid ${profileData.preferredColor}`,
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Tooltip title="Changer la photo">
                    <IconButton
                      sx={{
                        bgcolor: "background.paper",
                        width: 36,
                        height: 36,
                        boxShadow: 1,
                      }}
                      onClick={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    >
                      {uploadingPhoto ? (
                        <CircularProgress size={24} />
                      ) : (
                        <PhotoCameraIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    bgcolor: profilePhotoColor,
                    fontSize: 48,
                    fontWeight: "bold",
                    boxShadow: 3,
                    border: `4px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {getInitials()}
                </Avatar>
              </Badge>

              <Typography variant="h5" component="h1" gutterBottom>
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
                variant="filled"
                sx={{ mb: 1 }}
              />

              {profileData.department && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  {profileData.department}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                mb: 3,
                bgcolor: theme.palette.background.default,
                borderRadius: 1,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                À propos de moi
              </Typography>
              <Typography variant="body2">{profileData.bio}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Complétion du profil
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProfileCompletion()}
                sx={{ height: 8, borderRadius: 1, mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {calculateProfileCompletion()}% complété
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Informations de contact
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={profileData.email}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BadgeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nom d'utilisateur"
                    secondary={profileData.username}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
                {user?.createdAt && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Membre depuis"
                      secondary={formatDate(user.createdAt)}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                )}
              </List>
            </Box>

            <Box sx={{ mt: "auto", pt: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<EditIcon />}
                onClick={handleEditMode}
                disabled={editMode}
              >
                Modifier le profil
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Section droite - Onglets et contenu principal */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 0,
              borderTop: `4px solid ${profileData.preferredColor}`,
              transition: "all 0.3s ease",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
            >
              <Tab
                label="Statistiques"
                icon={<DashboardIcon />}
                iconPosition="start"
              />
              <Tab
                label="Activité récente"
                icon={<HistoryIcon />}
                iconPosition="start"
              />
              <Tab
                label="Paramètres"
                icon={<SettingsIcon />}
                iconPosition="start"
              />
              {editMode && (
                <Tab
                  label="Édition du profil"
                  icon={<EditIcon />}
                  iconPosition="start"
                />
              )}
            </Tabs>

            {/* Panneau des statistiques */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Vos statistiques de réservation
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: "100%" }}>
                      <CardHeader
                        title="Réservations"
                        avatar={
                          <Avatar sx={{ bgcolor: profileData.preferredColor }}>
                            <EventIcon />
                          </Avatar>
                        }
                      />
                      <CardContent>
                        <Typography variant="h4" component="div" gutterBottom>
                          {stats.totalReservations}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          réservations au total
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: "100%" }}>
                      <CardHeader
                        title="À venir"
                        avatar={
                          <Avatar sx={{ bgcolor: "success.main" }}>
                            <EventAvailableIcon />
                          </Avatar>
                        }
                      />
                      <CardContent>
                        <Typography variant="h4" component="div" gutterBottom>
                          {stats.upcomingReservations}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          réservations à venir
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: "100%" }}>
                      <CardHeader
                        title="Annulées"
                        avatar={
                          <Avatar sx={{ bgcolor: "error.main" }}>
                            <DoNotDisturbIcon />
                          </Avatar>
                        }
                      />
                      <CardContent>
                        <Typography variant="h4" component="div" gutterBottom>
                          {stats.cancelledReservations}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          réservations annulées
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Habitudes de réservation
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <RoomIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Salle préférée"
                              secondary={stats.mostUsedRoom}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CalendarTodayIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Jour préféré"
                              secondary={stats.mostFrequentDay}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BookmarkIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Ce mois-ci"
                              secondary={`${stats.reservationsThisMonth} réservation(s)`}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Actions rapides
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Button
                            variant="outlined"
                            startIcon={<EventIcon />}
                            onClick={() => navigate("/dashboard")}
                            fullWidth
                          >
                            Nouvelle réservation
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<EventAvailableIcon />}
                            onClick={() => navigate("/my-reservations")}
                            fullWidth
                          >
                            Mes réservations
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<SecurityIcon />}
                            onClick={() => {
                              setEditMode(true);
                              setShowPasswordForm(true);
                              setActiveTab(3);
                            }}
                            fullWidth
                          >
                            Changer de mot de passe
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Panneau d'activité récente */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Activité récente
                </Typography>

                <Card>
                  <List>
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemIcon>
                              {getActivityIcon(activity)}
                            </ListItemIcon>
                            <ListItemText
                              primary={getActivityText(activity)}
                              secondary={formatActivityDate(activity.date)}
                            />
                          </ListItem>
                          {index < recentActivity.length - 1 && <Divider />}
                        </React.Fragment>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText
                          primary="Aucune activité récente"
                          secondary="Vos activités récentes apparaîtront ici"
                        />
                      </ListItem>
                    )}
                  </List>
                </Card>
              </Box>
            )}

            {/* Panneau des paramètres */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Paramètres
                </Typography>

                <Card sx={{ mb: 3 }}>
                  <CardHeader title="Notifications" />
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <NotificationsIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Notifications par email"
                          secondary="Recevoir des emails pour les confirmations et rappels"
                        />
                        <Switch
                          edge="end"
                          checked={profileData.notifications}
                          onChange={handleSwitchChange("notifications")}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <DarkModeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Mode sombre"
                          secondary="Utiliser le thème sombre pour l'interface"
                        />
                        <Switch
                          edge="end"
                          checked={profileData.darkMode}
                          onChange={handleSwitchChange("darkMode")}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader title="Personnalisation" />
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Couleur du profil
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {profileColors.map((color) => (
                        <Tooltip title={color} key={color}>
                          <IconButton
                            sx={{
                              bgcolor: color,
                              width: 40,
                              height: 40,
                              "&:hover": {
                                bgcolor: color,
                                opacity: 0.8,
                              },
                              border:
                                profileData.preferredColor === color
                                  ? "2px solid white"
                                  : "none",
                              outline:
                                profileData.preferredColor === color
                                  ? `2px solid ${color}`
                                  : "none",
                            }}
                            onClick={() => handleColorChange(color)}
                          />
                        </Tooltip>
                      ))}
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          setSuccess("Paramètres enregistrés avec succès")
                        }
                        startIcon={<SaveIcon />}
                      >
                        Enregistrer les paramètres
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Panneau d'édition du profil */}
            {activeTab === 3 && editMode && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Modifier votre profil
                </Typography>

                {showPasswordForm ? (
                  // Formulaire de changement de mot de passe
                  <form onSubmit={handlePasswordSubmit}>
                    <Card sx={{ mb: 3 }}>
                      <CardHeader title="Changer le mot de passe" />
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              type="password"
                              label="Mot de passe actuel"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              type="password"
                              label="Nouveau mot de passe"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              required
                              helperText="Au moins 6 caractères"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              type="password"
                              label="Confirmer le mot de passe"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                              error={
                                passwordData.newPassword !==
                                passwordData.confirmPassword
                              }
                              helperText={
                                passwordData.newPassword !==
                                passwordData.confirmPassword
                                  ? "Les mots de passe ne correspondent pas"
                                  : ""
                              }
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => setShowPasswordForm(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        disabled={saving}
                      >
                        {saving
                          ? "Enregistrement..."
                          : "Changer le mot de passe"}
                      </Button>
                    </Box>
                  </form>
                ) : (
                  // Formulaire d'édition du profil
                  <form onSubmit={handleSubmit}>
                    <Card sx={{ mb: 3 }}>
                      <CardHeader title="Informations personnelles" />
                      <CardContent>
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
                              disabled
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Email"
                              name="email"
                              value={profileData.email}
                              onChange={handleChange}
                              required
                              type="email"
                            />
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
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel id="role-label">Rôle</InputLabel>
                              <Select
                                labelId="role-label"
                                id="role"
                                name="role"
                                value={profileData.role}
                                label="Rôle"
                                onChange={handleChange}
                                disabled
                              >
                                <MenuItem value="student">Étudiant</MenuItem>
                                <MenuItem value="teacher">Enseignant</MenuItem>
                                <MenuItem value="admin">
                                  Administrateur
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Biographie"
                              name="bio"
                              value={profileData.bio}
                              onChange={handleChange}
                              multiline
                              rows={4}
                              placeholder="Parlez-nous de vous..."
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelEdit}
                      >
                        Annuler
                      </Button>
                      <Box>
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<SecurityIcon />}
                          onClick={() => setShowPasswordForm(true)}
                          sx={{ mr: 1 }}
                        >
                          Changer le mot de passe
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                          disabled={saving}
                        >
                          {saving ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                      </Box>
                    </Box>
                  </form>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
