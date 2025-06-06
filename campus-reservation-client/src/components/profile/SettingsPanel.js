import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const SettingsPanel = ({ 
  profileData, 
  onProfileChange, 
  onSuccess 
}) => {
  const handleSwitchChange = (name) => (event) => {
    onProfileChange({ [name]: event.target.checked });
  };

  const handleSaveSettings = () => {
    onSuccess("Paramètres enregistrés avec succès");
  };

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 600, 
          color: "#1e293b", 
          mb: 4 
        }}
      >
        Paramètres du compte
      </Typography>

      {/* Message d'information */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4,
          borderRadius: 2,
          border: "1px solid #bfdbfe",
        }}
      >
        Personnalisez votre expérience et gérez vos préférences de compte.
      </Alert>

      {/* Notifications */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 4,
          border: "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <NotificationsIcon sx={{ color: "#3730a3", mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
              Notifications
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Gérez vos préférences de notifications
          </Typography>
        </Box>
        
        <List sx={{ p: 0 }}>
          <ListItem sx={{ py: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <NotificationsIcon sx={{ color: "#3730a3" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#1e293b" }}>
                  Notifications par email
                </Typography>
              }
              secondary={
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Recevoir des emails pour les confirmations et rappels de réservation
                </Typography>
              }
            />
            <Switch
              edge="end"
              checked={profileData?.notifications || false}
              onChange={handleSwitchChange("notifications")}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#3730a3",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#3730a3",
                },
              }}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Thème et apparence */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 4,
          border: "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <DarkModeIcon sx={{ color: "#3730a3", mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
              Thème et apparence
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Personnalisez l'apparence de l'interface
          </Typography>
        </Box>
        
        <List sx={{ p: 0 }}>
          <ListItem sx={{ py: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <DarkModeIcon sx={{ color: "#3730a3" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#1e293b" }}>
                  Mode sombre
                </Typography>
              }
              secondary={
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Utiliser le thème sombre pour l'interface (bientôt disponible)
                </Typography>
              }
            />
            <Switch
              edge="end"
              checked={false}
              disabled
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#3730a3",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#3730a3",
                },
              }}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Sécurité */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 4,
          border: "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <SecurityIcon sx={{ color: "#dc2626", mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
              Sécurité
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Paramètres de sécurité et confidentialité
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ borderRadius: 2, mb: 2 }}>
            Pour des raisons de sécurité, les paramètres avancés sont gérés par l'administration.
          </Alert>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Si vous souhaitez modifier vos paramètres de sécurité, veuillez contacter l'administrateur système.
          </Typography>
        </Box>
      </Paper>

      {/* Bouton de sauvegarde */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSaveSettings}
          startIcon={<SaveIcon />}
          sx={{
            backgroundColor: "#3730a3",
            py: 1.5,
            px: 4,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#1e40af",
              transform: "translateY(-1px)",
              boxShadow: "0 10px 25px rgba(55, 48, 163, 0.3)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Enregistrer les paramètres
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPanel; 