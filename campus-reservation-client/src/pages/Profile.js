import React, { useEffect } from "react";
import {
  Container,
  Grid,
  Alert,
  CircularProgress,
  Typography,
  Fade,
} from "@mui/material";
import useProfile from "../hooks/useProfile";
import useProfileEdit from "../hooks/useProfileEdit";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";

const Profile = () => {
  // Hook principal pour les données du profil
  const {
    loading,
    error,
    success,
    profileData,
    stats,
    recentActivity,
    user,
    updateProfileData,
    changeColor,
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

  // Debug: Log des données de profil dans le composant principal
  useEffect(() => {
    console.log('🏠 Profile.js - ProfileData mis à jour:', {
      preferredColor: profileData?.preferredColor,
      fullData: profileData
    });
  }, [profileData]);

  // Gérer les changements dans le formulaire
  const handleProfileChange = (updates) => {
    console.log('🔄 Profile.js - handleProfileChange appelé avec:', updates);
    updateProfileData(updates);
  };

  // Gérer l'édition du mot de passe depuis les stats
  const handleEditPassword = () => {
    handleEditMode();
    setShowPasswordForm(true);
  };

  // Affichage du loading
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

  // Vérifications de sécurité
  if (!profileData) {
    console.error('❌ Profile.js - Pas de données de profil !');
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Erreur: Impossible de charger les données du profil
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Messages d'erreur et de succès */}
      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearMessages}>
            {error}
          </Alert>
        </Fade>
      )}

      {success && (
        <Fade in={!!success}>
          <Alert severity="success" sx={{ mb: 3 }} onClose={clearMessages}>
            {success}
          </Alert>
        </Fade>
      )}

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
            onColorChange={changeColor}
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
    </Container>
  );
};

export default Profile;
