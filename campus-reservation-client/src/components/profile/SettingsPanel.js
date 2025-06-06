import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Button,
  Tooltip,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { PROFILE_COLORS, COLOR_NAMES } from '../../utils/profileConstants';

const SettingsPanel = ({ 
  profileData, 
  onProfileChange, 
  onColorChange, 
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
      <Typography variant="h6" gutterBottom>
        Paramètres
      </Typography>

      {/* Personnalisation */}
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Personnalisation" 
          avatar={<PaletteIcon />}
        />
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Couleur du profil
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choisissez une couleur pour personnaliser votre profil. Le changement est immédiat.
          </Typography>
          
          {/* Couleur actuelle */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Couleur actuelle
            </Typography>
            <Chip
              icon={<CheckIcon />}
              label={`${COLOR_NAMES[profileData.preferredColor] || 'Couleur personnalisée'} (${profileData.preferredColor})`}
              sx={{
                bgcolor: profileData.preferredColor,
                color: 'white',
                fontWeight: 'bold',
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          </Box>

          {/* Sélecteur de couleurs */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Sélectionner une nouvelle couleur
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {PROFILE_COLORS.map((color) => (
                <Tooltip 
                  title={`${COLOR_NAMES[color]} (${color})`} 
                  key={color}
                  arrow
                >
                  <IconButton
                    sx={{
                      bgcolor: color,
                      width: 48,
                      height: 48,
                      border: '3px solid',
                      borderColor: profileData.preferredColor === color 
                        ? 'white' 
                        : 'transparent',
                      boxShadow: profileData.preferredColor === color 
                        ? `0 0 0 2px ${color}` 
                        : 'none',
                      "&:hover": {
                        bgcolor: color,
                        opacity: 0.8,
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                      position: 'relative',
                    }}
                    onClick={() => onColorChange(color)}
                  >
                    {profileData.preferredColor === color && (
                      <CheckIcon 
                        sx={{ 
                          color: 'white', 
                          fontSize: 24,
                          fontWeight: 'bold',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                        }} 
                      />
                    )}
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </Box>

          {/* Aperçu */}
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 1, 
              border: `2px solid ${profileData.preferredColor}`,
              bgcolor: 'background.default',
              mb: 3,
              background: `linear-gradient(135deg, ${profileData.preferredColor}11 0%, ${profileData.preferredColor}22 100%)`,
            }}
          >
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Aperçu de la couleur sélectionnée
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: profileData.preferredColor, fontWeight: 'bold' }}
            >
              Cette couleur ({COLOR_NAMES[profileData.preferredColor] || 'Personnalisée'}) sera utilisée pour les bordures, accents et éléments de votre profil
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Notifications */}
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
                color="primary"
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
                color="primary"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde général */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSaveSettings}
          startIcon={<SaveIcon />}
          sx={{
            bgcolor: profileData.preferredColor,
            '&:hover': {
              bgcolor: profileData.preferredColor,
              opacity: 0.8,
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 20px ${profileData.preferredColor}44`,
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          Enregistrer tous les paramètres
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPanel; 