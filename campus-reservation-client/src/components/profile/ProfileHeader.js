import React from 'react';
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
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarTodayIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { getRoleDisplay, getInitials, formatDate, calculateProfileCompletion } from '../../utils/profileUtils';

const ProfileHeader = ({ 
  profileData, 
  user, 
  onEditMode, 
  editMode, 
  onPhotoUpload, 
  uploadingPhoto 
}) => {
  // S'assurer qu'on a des données valides
  if (!profileData) {
    console.warn('⚠️ ProfileHeader - Pas de données de profil');
    return null;
  }

  // Obtenir l'icône et la couleur selon le rôle
  const getRoleConfig = (role) => {
    switch (role) {
      case "admin":
        return { icon: <AdminIcon />, color: "#dc2626", bgColor: "#dc262615" };
      case "teacher":
        return { icon: <SchoolIcon />, color: "#3730a3", bgColor: "#3730a315" };
      default:
        return { icon: <PersonIcon />, color: "#059669", bgColor: "#05966915" };
    }
  };

  const roleConfig = getRoleConfig(profileData.role);
  const completion = calculateProfileCompletion(profileData);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        background: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header avec gradient */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #3730a3 0%, #1e40af 100%)",
          color: "white",
          p: 3,
          m: -4,
          mb: 4,
          borderRadius: "12px 12px 0 0",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Tooltip title="Changer la photo">
              <IconButton
                sx={{
                  bgcolor: "white",
                  width: 40,
                  height: 40,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  border: "2px solid white",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
                onClick={onPhotoUpload}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <CircularProgress size={20} sx={{ color: "#3730a3" }} />
                ) : (
                  <PhotoCameraIcon fontSize="small" sx={{ color: "#3730a3" }} />
                )}
              </IconButton>
            </Tooltip>
          }
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              bgcolor: "rgba(255,255,255,0.2)",
              fontSize: 36,
              fontWeight: 700,
              border: "4px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            {getInitials(profileData.firstName, profileData.lastName, profileData.username)}
          </Avatar>
        </Badge>

        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            letterSpacing: "-0.02em",
            mb: 1,
          }}
        >
          {profileData.firstName} {profileData.lastName}
        </Typography>

        <Chip
          icon={roleConfig.icon}
          label={getRoleDisplay(profileData.role)}
          sx={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 600,
            backdropFilter: "blur(10px)",
            "& .MuiChip-icon": {
              color: "white",
            },
          }}
        />
      </Box>

      {/* Complétion du profil */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Profil complété
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#3730a3" }}>
            {completion}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={completion}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: "#e2e8f0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: completion < 50 ? "#dc2626" : completion < 80 ? "#d97706" : "#10b981",
              borderRadius: 4,
            },
          }}
        />
        <Typography variant="caption" sx={{ color: "#64748b", mt: 1, display: "block" }}>
          {completion < 50 ? "Complétez votre profil pour une meilleure expérience" : 
           completion < 80 ? "Votre profil est presque complet" : 
           "Excellent ! Votre profil est complet"}
        </Typography>
      </Box>

      {/* À propos de moi */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}>
          À propos de moi
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.6 }}>
            {profileData.bio || "Aucune biographie renseignée pour le moment."}
          </Typography>
        </Paper>
      </Box>

      {/* Informations de contact */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}>
          Informations
        </Typography>
        <List sx={{ p: 0 }}>
          <ListItem
            sx={{
              px: 0,
              py: 1.5,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <EmailIcon sx={{ color: "#3730a3" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                  Email
                </Typography>
              }
              secondary={
                <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                  {profileData.email}
                </Typography>
              }
            />
          </ListItem>
          
          <ListItem
            sx={{
              px: 0,
              py: 1.5,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <BadgeIcon sx={{ color: "#3730a3" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                  Nom d'utilisateur
                </Typography>
              }
              secondary={
                <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                  {profileData.username}
                </Typography>
              }
            />
          </ListItem>

          {profileData.department && (
            <ListItem
              sx={{
                px: 0,
                py: 1.5,
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SchoolIcon sx={{ color: "#3730a3" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                    Département
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                    {profileData.department}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {user?.createdAt && (
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CalendarTodayIcon sx={{ color: "#3730a3" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                    Membre depuis
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                    {formatDate(user.createdAt)}
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Box>

      {/* Bouton d'édition */}
      <Box sx={{ mt: "auto" }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<EditIcon />}
          onClick={onEditMode}
          disabled={editMode}
          sx={{
            backgroundColor: "#3730a3",
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#1e40af",
              transform: "translateY(-1px)",
              boxShadow: "0 10px 25px rgba(55, 48, 163, 0.3)",
            },
            "&:disabled": {
              backgroundColor: "#94a3b8",
              color: "white",
            },
            transition: "all 0.2s ease",
          }}
        >
          {editMode ? "Édition en cours..." : "Modifier le profil"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfileHeader; 