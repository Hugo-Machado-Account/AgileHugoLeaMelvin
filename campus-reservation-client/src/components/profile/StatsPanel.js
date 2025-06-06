import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
} from '@mui/material';
import {
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  DoNotDisturb as DoNotDisturbIcon,
  Room as RoomIcon,
  CalendarToday as CalendarTodayIcon,
  Bookmark as BookmarkIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const StatsPanel = ({ stats, profileData, onEditPassword }) => {
  const navigate = useNavigate();

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
        Vos statistiques de réservation
      </Typography>

      <Grid container spacing={3}>
        {/* Statistiques principales */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              height: "100%",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(55, 48, 163, 0.15)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: "#3730a3",
                  width: 48,
                  height: 48,
                  mr: 2,
                }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ 
                    color: "#3730a3", 
                    fontWeight: 700,
                  }}>
                    {stats.totalReservations}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                    Total réservations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              height: "100%",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.15)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: "#10b981",
                  width: 48,
                  height: 48,
                  mr: 2,
                }}>
                  <EventAvailableIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ 
                    color: "#10b981", 
                    fontWeight: 700,
                  }}>
                    {stats.upcomingReservations}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                    À venir
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              height: "100%",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(220, 38, 38, 0.15)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: "#dc2626",
                  width: 48,
                  height: 48,
                  mr: 2,
                }}>
                  <DoNotDisturbIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ 
                    color: "#dc2626", 
                    fontWeight: 700,
                  }}>
                    {stats.cancelledReservations}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                    Annulées
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Habitudes de réservation */}
        <Grid item xs={12} sm={6}>
          <Paper 
            elevation={0}
            sx={{ 
              height: "100%",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <TrendingUpIcon sx={{ color: "#3730a3", mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                Habitudes de réservation
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              <ListItem sx={{ px: 0, py: 1.5, borderBottom: "1px solid #f1f5f9" }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <RoomIcon sx={{ color: "#3730a3" }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                      Salle préférée
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                      {stats.mostUsedRoom}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1.5, borderBottom: "1px solid #f1f5f9" }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CalendarTodayIcon sx={{ color: "#3730a3" }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                      Jour préféré
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                      {stats.mostFrequentDay}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <BookmarkIcon sx={{ color: "#3730a3" }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                      Ce mois-ci
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                      {stats.reservationsThisMonth} réservation(s)
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Actions rapides */}
        <Grid item xs={12} sm={6}>
          <Paper 
            elevation={0}
            sx={{ 
              height: "100%",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}>
              Actions rapides
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<EventIcon />}
                onClick={() => navigate("/dashboard")}
                fullWidth
                sx={{
                  backgroundColor: "#3730a3",
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#1e40af",
                    transform: "translateY(-1px)",
                    boxShadow: "0 10px 25px rgba(55, 48, 163, 0.3)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Nouvelle réservation
              </Button>
              <Button
                variant="outlined"
                startIcon={<EventAvailableIcon />}
                onClick={() => navigate("/my-reservations")}
                fullWidth
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#3730a3",
                    backgroundColor: "#f8fafc",
                    color: "#3730a3",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Mes réservations
              </Button>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={onEditPassword}
                fullWidth
                sx={{
                  borderColor: "#fca5a5",
                  color: "#dc2626",
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#dc2626",
                    backgroundColor: "#fef2f2",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Changer de mot de passe
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsPanel; 