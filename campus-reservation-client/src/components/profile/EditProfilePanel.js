import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const EditProfilePanel = ({
  profileData,
  passwordData,
  showPasswordForm,
  saving,
  onProfileChange,
  onPasswordChange,
  onSubmit,
  onPasswordSubmit,
  onCancel,
  onShowPasswordForm,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onProfileChange({ [name]: value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onSubmit(profileData);
  };

  if (showPasswordForm) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Changer le mot de passe
        </Typography>

        <form onSubmit={onPasswordSubmit}>
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
                    onChange={onPasswordChange}
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
                    onChange={onPasswordChange}
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
                    onChange={onPasswordChange}
                    required
                    error={
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                    helperText={
                      passwordData.newPassword !== passwordData.confirmPassword
                        ? "Les mots de passe ne correspondent pas"
                        : ""
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => onShowPasswordForm(false)}
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
              {saving ? "Enregistrement..." : "Changer le mot de passe"}
            </Button>
          </Box>
        </form>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Modifier votre profil
      </Typography>

      <form onSubmit={handleProfileSubmit}>
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
                    <MenuItem value="admin">Administrateur</MenuItem>
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

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Box>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<SecurityIcon />}
              onClick={() => onShowPasswordForm(true)}
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
    </Box>
  );
};

export default EditProfilePanel; 