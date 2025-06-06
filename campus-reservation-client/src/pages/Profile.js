import React from "react";
import {
  Container,
  Grid,
  Alert,
  CircularProgress,
  Typography,
  Fade,
  Box,
  LinearProgress,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import useProfile from "../hooks/useProfile";
import useProfileEdit from "../hooks/useProfileEdit";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";

const Profile = () => {
  const { user } = useAuth();

  // Hook principal pour les données du profil
  const {
    loading,
    error,
    success,
    profileData,
    stats,
    recentActivity,
    updateProfileData,
    showSuccess,
    showError,
    clearMessages,
  } = useProfile();

  // Hook pour la gestion de l'édition
  const {
    editMode,
    saving,
    showPasswordForm,
    uploadingPhoto,
    passwordData,
    handleEditMode,
    handleCancelEdit,
    handlePasswordChange,
    handlePhotoUpload,
    handleSubmit,
    handlePasswordSubmit,
    setShowPasswordForm,
  } = useProfileEdit(profileData, showSuccess, showError);

  // Gérer les changements dans le formulaire
  const handleProfileChange = (updates) => {
    updateProfileData(updates);
  };

  // Gérer l'édition du mot de passe depuis les stats
  const handleEditPassword = () => {
    handleEditMode();
    setShowPasswordForm(true);
  };

  // Affichage du loading
  if (loading) {
    return (
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <CircularProgress sx={{ color: "#3730a3" }} />
            <Typography variant="h6" sx={{ mt: 2, color: "#64748b" }}>
              Chargement du profil...
            </Typography>
          </Box>
          <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
        </Container>
      </Box>
    );
  }

  // Afficher une erreur si pas de données
  if (!profileData || !user) {
    return (
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
        <Container sx={{ textAlign: "center" }}>
          <Alert 
            severity="error"
            sx={{
              borderRadius: 3,
              border: "1px solid #fca5a5",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Erreur: Impossible de charger les données du profil
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Veuillez vous reconnecter ou contacter l'administrateur.
        </Typography>
          </Alert>
      </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Messages d'erreur et de succès */}
      {error && (
        <Fade in={!!error}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: "1px solid #fca5a5",
              }} 
              onClose={clearMessages}
            >
            {error}
          </Alert>
        </Fade>
      )}

      {success && (
        <Fade in={!!success}>
          <Alert
            severity="success"
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: "1px solid #bbf7d0",
              }} 
              onClose={clearMessages}
          >
            {success}
          </Alert>
        </Fade>
      )}

        <Fade in={!loading} timeout={600}>
      <Grid container spacing={4}>
        {/* Section gauche - Photo et informations personnelles */}
        <Grid item xs={12} md={4}>
              <ProfileHeader
                profileData={profileData}
                user={user}
                onEditMode={handleEditMode}
                editMode={editMode}
                onPhotoUpload={handlePhotoUpload}
                uploadingPhoto={uploadingPhoto}
              />
        </Grid>

        {/* Section droite - Onglets et contenu principal */}
        <Grid item xs={12} md={8}>
              <ProfileTabs
                profileData={profileData}
                stats={stats}
                recentActivity={recentActivity}
                editMode={editMode}
                passwordData={passwordData}
                showPasswordForm={showPasswordForm}
                saving={saving}
                onProfileChange={handleProfileChange}
                onPasswordChange={handlePasswordChange}
                onSubmit={handleSubmit}
                onPasswordSubmit={handlePasswordSubmit}
                onCancelEdit={handleCancelEdit}
                onShowPasswordForm={setShowPasswordForm}
                onSuccess={showSuccess}
                onEditPassword={handleEditPassword}
              />
                  </Grid>
                </Grid>
        </Fade>
      </Container>
              </Box>
  );
};

export default Profile;
