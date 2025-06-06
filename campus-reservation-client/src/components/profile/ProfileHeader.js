import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Badge,
  Tooltip,
  IconButton,
  CircularProgress,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarTodayIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { PROFILE_COLORS } from '../../utils/profileConstants';
import { getRoleDisplay, getInitials, formatDate, calculateProfileCompletion } from '../../utils/profileUtils';

const ProfileHeader = ({ 
  profileData, 
  user, 
  onEditMode, 
  editMode, 
  onPhotoUpload, 
  uploadingPhoto 
}) => {
  const theme = useTheme();
  
  // Simulons une couleur de photo aléatoire
  const [profilePhotoColor] = useState(
    PROFILE_COLORS[Math.floor(Math.random() * PROFILE_COLORS.length)]
  );

  // Debug: Log du changement de couleur
  useEffect(() => {
    console.log('🎨 ProfileHeader - Couleur reçue:', profileData?.preferredColor);
  }, [profileData?.preferredColor]);

  // S'assurer qu'on a des données valides
  if (!profileData) {
    console.warn('⚠️ ProfileHeader - Pas de données de profil');
    return null;
  }

  const currentColor = profileData.preferredColor || PROFILE_COLORS[0];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderTop: `4px solid ${currentColor}`,
        transition: "all 0.3s ease-in-out",
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${currentColor}, ${currentColor}cc)`,
          transition: 'all 0.3s ease-in-out',
        }
      }}
    >
      {/* Photo et informations principales */}
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
                  border: `2px solid ${currentColor}`,
                  transition: "all 0.3s ease-in-out",
                  '&:hover': {
                    borderColor: currentColor,
                    boxShadow: `0 0 0 2px ${currentColor}44`,
                  }
                }}
                onClick={onPhotoUpload}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <CircularProgress size={24} sx={{ color: currentColor }} />
                ) : (
                  <PhotoCameraIcon fontSize="small" sx={{ color: currentColor }} />
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
              transition: "all 0.3s ease-in-out",
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                border: `2px solid ${currentColor}`,
                borderRadius: '50%',
                transition: 'all 0.3s ease-in-out',
              }
            }}
          >
            {getInitials(profileData.firstName, profileData.lastName, profileData.username)}
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
          sx={{ 
            mb: 1,
            transition: "all 0.3s ease-in-out",
            ...(profileData.role !== "admin" && profileData.role !== "teacher" && {
              bgcolor: currentColor,
              color: 'white',
              '& .MuiChip-label': {
                fontWeight: 'bold'
              }
            })
          }}
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

      {/* À propos de moi */}
      <Box
        sx={{
          mb: 3,
          bgcolor: theme.palette.background.default,
          borderRadius: 1,
          p: 2,
          border: `1px solid ${currentColor}22`,
          transition: "all 0.3s ease-in-out",
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

      {/* Complétion du profil */}
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
          value={calculateProfileCompletion(profileData)}
          sx={{ 
            height: 8, 
            borderRadius: 1, 
            mb: 1,
            bgcolor: `${currentColor}22`,
            '& .MuiLinearProgress-bar': {
              bgcolor: currentColor,
              transition: 'all 0.3s ease-in-out',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {calculateProfileCompletion(profileData)}% complété
        </Typography>
      </Box>

      {/* Informations de contact */}
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
              <EmailIcon fontSize="small" sx={{ color: currentColor }} />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={profileData.email}
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BadgeIcon fontSize="small" sx={{ color: currentColor }} />
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
                <CalendarTodayIcon fontSize="small" sx={{ color: currentColor }} />
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

      {/* Bouton d'édition */}
      <Box sx={{ mt: "auto", pt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<EditIcon />}
          onClick={onEditMode}
          disabled={editMode}
          sx={{
            borderColor: currentColor,
            color: currentColor,
            transition: "all 0.3s ease-in-out",
            '&:hover': {
              borderColor: currentColor,
              bgcolor: `${currentColor}11`,
            },
            '&.Mui-disabled': {
              borderColor: `${currentColor}44`,
              color: `${currentColor}44`,
            }
          }}
        >
          Modifier le profil
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfileHeader; 