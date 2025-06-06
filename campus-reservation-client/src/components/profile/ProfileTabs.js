import React, { useState, useEffect } from 'react';
import {
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { PROFILE_TABS } from '../../utils/profileConstants';
import StatsPanel from './StatsPanel';
import ActivityPanel from './ActivityPanel';
import SettingsPanel from './SettingsPanel';
import EditProfilePanel from './EditProfilePanel';

const ProfileTabs = ({
  profileData,
  stats,
  recentActivity,
  editMode,
  passwordData,
  showPasswordForm,
  saving,
  onProfileChange,
  onColorChange,
  onPasswordChange,
  onSubmit,
  onPasswordSubmit,
  onCancelEdit,
  onShowPasswordForm,
  onSuccess,
  onEditPassword,
}) => {
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.STATS);

  // Debug: Log du changement de couleur
  useEffect(() => {
    console.log('🎨 ProfileTabs - Couleur reçue:', profileData?.preferredColor);
  }, [profileData?.preferredColor]);

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Quand on active le mode édition, passer à l'onglet d'édition
  React.useEffect(() => {
    if (editMode) {
      setActiveTab(PROFILE_TABS.EDIT);
    }
  }, [editMode]);

  // Quand on désactive le mode édition, revenir aux stats
  const handleCancelEdit = () => {
    onCancelEdit();
    setActiveTab(PROFILE_TABS.STATS);
  };

  // Gérer l'édition du mot de passe depuis les stats
  const handleEditPassword = () => {
    onEditPassword();
    setActiveTab(PROFILE_TABS.EDIT);
  };

  // S'assurer qu'on a des données de profil valides
  if (!profileData || !profileData.preferredColor) {
    console.warn('⚠️ ProfileTabs - Données de profil manquantes:', profileData);
    return null;
  }

  const currentColor = profileData.preferredColor;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
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
          background: `linear-gradient(90deg, ${currentColor}, ${currentColor}aa, ${currentColor})`,
          transition: 'all 0.3s ease-in-out',
        }
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          borderBottom: 1, 
          borderColor: "divider", 
          mb: 3,
          '& .MuiTab-root': {
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              color: currentColor,
            }
          },
          '& .Mui-selected': {
            color: `${currentColor} !important`,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: currentColor,
            height: 3,
            transition: 'all 0.3s ease-in-out',
          },
          '& .MuiTab-root .MuiSvgIcon-root': {
            transition: 'all 0.3s ease-in-out',
          },
          '& .Mui-selected .MuiSvgIcon-root': {
            color: currentColor,
          }
        }}
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
      {activeTab === PROFILE_TABS.STATS && (
        <StatsPanel
          stats={stats}
          profileData={profileData}
          onEditPassword={handleEditPassword}
        />
      )}

      {/* Panneau d'activité récente */}
      {activeTab === PROFILE_TABS.ACTIVITY && (
        <ActivityPanel recentActivity={recentActivity} />
      )}

      {/* Panneau des paramètres */}
      {activeTab === PROFILE_TABS.SETTINGS && (
        <SettingsPanel
          profileData={profileData}
          onProfileChange={onProfileChange}
          onColorChange={onColorChange}
          onSuccess={onSuccess}
        />
      )}

      {/* Panneau d'édition du profil */}
      {activeTab === PROFILE_TABS.EDIT && editMode && (
        <EditProfilePanel
          profileData={profileData}
          passwordData={passwordData}
          showPasswordForm={showPasswordForm}
          saving={saving}
          onProfileChange={onProfileChange}
          onPasswordChange={onPasswordChange}
          onSubmit={onSubmit}
          onPasswordSubmit={onPasswordSubmit}
          onCancel={handleCancelEdit}
          onShowPasswordForm={onShowPasswordForm}
        />
      )}
    </Paper>
  );
};

export default ProfileTabs;