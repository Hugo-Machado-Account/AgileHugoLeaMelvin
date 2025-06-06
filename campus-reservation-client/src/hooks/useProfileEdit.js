import { useState } from 'react';

const useProfileEdit = (initialProfileData, onSuccess, onError) => {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Activer le mode édition
  const handleEditMode = () => {
    setEditMode(true);
  };

  // Désactiver le mode édition
  const handleCancelEdit = () => {
    setEditMode(false);
    setShowPasswordForm(false);
  };

  // Gérer les changements dans le formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Simuler le téléchargement d'une photo
  const handlePhotoUpload = () => {
    setUploadingPhoto(true);
    
    setTimeout(() => {
      setUploadingPhoto(false);
      onSuccess("Photo de profil mise à jour avec succès");
    }, 1500);
  };

  // Soumettre le formulaire de profil
  const handleSubmit = async (profileData) => {
    setSaving(true);

    try {
      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess("Profil mis à jour avec succès");
      setSaving(false);
      setEditMode(false);
    } catch (err) {
      onError(err.message || "Une erreur est survenue lors de la mise à jour du profil");
      setSaving(false);
    }
  };

  // Soumettre le changement de mot de passe
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      onError("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      onError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setSaving(true);

    try {
      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess("Mot de passe mis à jour avec succès");
      setSaving(false);
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      onError(err.message || "Une erreur est survenue lors du changement de mot de passe");
      setSaving(false);
    }
  };

  return {
    // États
    editMode,
    saving,
    showPasswordForm,
    uploadingPhoto,
    passwordData,

    // Actions
    handleEditMode,
    handleCancelEdit,
    handlePasswordChange,
    handlePhotoUpload,
    handleSubmit,
    handlePasswordSubmit,
    setShowPasswordForm,
  };
};

export default useProfileEdit; 