import React, { useState } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Tune as TuneIcon,
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
  onPasswordChange,
  onSubmit,
  onPasswordSubmit,
  onCancelEdit,
  onShowPasswordForm,
  onSuccess,
  onEditPassword,
}) => {
  // Déterminer l'onglet actif selon le mode d'édition
  const getActiveTab = () => {
    if (editMode) return PROFILE_TABS.EDIT;
    return PROFILE_TABS.STATS;
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    // Ne pas changer d'onglet si on est en mode édition
    if (editMode && newValue !== PROFILE_TABS.EDIT) return;
    setActiveTab(newValue);
  };

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
  if (!profileData) {
    console.warn('⚠️ ProfileTabs - Pas de données de profil');
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        background: "white",
        overflow: "hidden",
      }}
    >
      {/* Header des onglets */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.95rem",
              color: "#64748b",
              minHeight: 64,
              "&:hover": {
                color: "#3730a3",
                backgroundColor: "rgba(55, 48, 163, 0.05)",
              },
              "&.Mui-selected": {
                color: "#3730a3",
                fontWeight: 600,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#3730a3",
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-iconWrapper": {
              marginBottom: 0,
              marginRight: 1,
            },
          }}
        >
          <Tab
            label="Statistiques"
            icon={<BarChartIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            value={PROFILE_TABS.STATS}
            disabled={editMode}
          />
          <Tab
            label="Activité récente"
            icon={<TimelineIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            value={PROFILE_TABS.ACTIVITY}
            disabled={editMode}
          />
          <Tab
            label="Paramètres"
            icon={<TuneIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            value={PROFILE_TABS.SETTINGS}
            disabled={editMode}
          />
          {editMode && (
            <Tab
              label="Édition du profil"
              icon={<EditIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              value={PROFILE_TABS.EDIT}
            />
          )}
        </Tabs>
      </Box>

      {/* Contenu des onglets */}
      <Box sx={{ p: 4 }}>
        {/* Panneau des statistiques */}
        {activeTab === PROFILE_TABS.STATS && !editMode && (
          <StatsPanel
            stats={stats}
            profileData={profileData}
            onEditPassword={handleEditPassword}
          />
        )}

        {/* Panneau d'activité récente */}
        {activeTab === PROFILE_TABS.ACTIVITY && !editMode && (
          <ActivityPanel recentActivity={recentActivity} />
        )}

        {/* Panneau des paramètres */}
        {activeTab === PROFILE_TABS.SETTINGS && !editMode && (
          <SettingsPanel
            profileData={profileData}
            onProfileChange={onProfileChange}
            onSuccess={onSuccess}
          />
        )}

        {/* Panneau d'édition du profil */}
        {editMode && (
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
      </Box>
    </Paper>
  );
};

export default ProfileTabs;