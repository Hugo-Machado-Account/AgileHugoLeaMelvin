import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Room as RoomIcon,
  Event as EventIcon,
} from "@mui/icons-material";

// Importer les composants admin existants avec leurs vrais noms de fichiers
import FloorEditor from "./FloorEditor";
import UsersList from "./UsersList";
import ReservationsManager from "./ReservationsManager";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(getActiveTab());

  // Déterminer l'onglet actif en fonction de l'URL
  function getActiveTab() {
    const path = location.pathname;
    if (path.includes("/users")) return 1;
    if (path.includes("/rooms")) return 2;
    if (path.includes("/reservations")) return 3;
    return 0; // Dashboard par défaut
  }

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);

    switch (newValue) {
      case 0:
        navigate("/admin");
        break;
      case 1:
        navigate("/admin/users");
        break;
      case 2:
        navigate("/admin/rooms");
        break;
      case 3:
        navigate("/admin/reservations");
        break;
      default:
        navigate("/admin");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Administration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les utilisateurs, les salles et les réservations
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Barre latérale */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ width: "100%" }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                icon={<DashboardIcon />}
                label="Tableau de bord"
                iconPosition="start"
              />
              <Tab
                icon={<PeopleIcon />}
                label="Utilisateurs"
                iconPosition="start"
              />
              <Tab icon={<RoomIcon />} label="Salles" iconPosition="start" />
              <Tab
                icon={<EventIcon />}
                label="Réservations"
                iconPosition="start"
              />
            </Tabs>
          </Paper>
        </Grid>

        {/* Contenu principal */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3, minHeight: "70vh" }}>
            <Routes>
              <Route path="/" element={<FloorEditor />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/rooms" element={<FloorEditor />} />
              <Route path="/reservations" element={<ReservationsManager />} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel;
