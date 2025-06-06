import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  DoNotDisturb as DoNotDisturbIcon,
  Room as RoomIcon,
  CalendarToday as CalendarTodayIcon,
  Bookmark as BookmarkIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const StatsPanel = ({ stats, profileData, onEditPassword }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Vos statistiques de réservation
      </Typography>

      <Grid container spacing={3}>
        {/* Statistiques principales */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: "100%",
            transition: "all 0.3s ease-in-out",
            '&:hover': {
              boxShadow: `0 4px 20px ${profileData.preferredColor}22`,
              transform: 'translateY(-2px)',
            }
          }}>
            <CardHeader
              title="Réservations"
              avatar={
                <Avatar sx={{ 
                  bgcolor: profileData.preferredColor,
                  transition: "all 0.3s ease-in-out",
                }}>
                  <EventIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom sx={{
                color: profileData.preferredColor,
                transition: "all 0.3s ease-in-out",
              }}>
                {stats.totalReservations}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                réservations au total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: "100%",
            transition: "all 0.3s ease-in-out",
            '&:hover': {
              boxShadow: "0 4px 20px rgba(76, 175, 80, 0.15)",
              transform: 'translateY(-2px)',
            }
          }}>
            <CardHeader
              title="À venir"
              avatar={
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <EventAvailableIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom sx={{
                color: "success.main",
              }}>
                {stats.upcomingReservations}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                réservations à venir
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: "100%",
            transition: "all 0.3s ease-in-out",
            '&:hover': {
              boxShadow: "0 4px 20px rgba(244, 67, 54, 0.15)",
              transform: 'translateY(-2px)',
            }
          }}>
            <CardHeader
              title="Annulées"
              avatar={
                <Avatar sx={{ bgcolor: "error.main" }}>
                  <DoNotDisturbIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom sx={{
                color: "error.main",
              }}>
                {stats.cancelledReservations}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                réservations annulées
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Habitudes de réservation */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            height: "100%",
            transition: "all 0.3s ease-in-out",
            border: `1px solid ${profileData.preferredColor}22`,
            '&:hover': {
              borderColor: `${profileData.preferredColor}44`,
              boxShadow: `0 4px 20px ${profileData.preferredColor}11`,
            }
          }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{
                color: profileData.preferredColor,
                fontWeight: 'bold',
                transition: "all 0.3s ease-in-out",
              }}>
                Habitudes de réservation
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <RoomIcon fontSize="small" sx={{ 
                      color: profileData.preferredColor,
                      transition: "all 0.3s ease-in-out",
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Salle préférée"
                    secondary={stats.mostUsedRoom}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon fontSize="small" sx={{ 
                      color: profileData.preferredColor,
                      transition: "all 0.3s ease-in-out",
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Jour préféré"
                    secondary={stats.mostFrequentDay}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BookmarkIcon fontSize="small" sx={{ 
                      color: profileData.preferredColor,
                      transition: "all 0.3s ease-in-out",
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ce mois-ci"
                    secondary={`${stats.reservationsThisMonth} réservation(s)`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions rapides */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            height: "100%",
            transition: "all 0.3s ease-in-out",
            border: `1px solid ${profileData.preferredColor}22`,
            '&:hover': {
              borderColor: `${profileData.preferredColor}44`,
              boxShadow: `0 4px 20px ${profileData.preferredColor}11`,
            }
          }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{
                color: profileData.preferredColor,
                fontWeight: 'bold',
                transition: "all 0.3s ease-in-out",
              }}>
                Actions rapides
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<EventIcon />}
                  onClick={() => navigate("/dashboard")}
                  fullWidth
                  sx={{
                    borderColor: profileData.preferredColor,
                    color: profileData.preferredColor,
                    transition: "all 0.3s ease-in-out",
                    '&:hover': {
                      borderColor: profileData.preferredColor,
                      bgcolor: `${profileData.preferredColor}11`,
                    }
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
                    borderColor: profileData.preferredColor,
                    color: profileData.preferredColor,
                    transition: "all 0.3s ease-in-out",
                    '&:hover': {
                      borderColor: profileData.preferredColor,
                      bgcolor: `${profileData.preferredColor}11`,
                    }
                  }}
                >
                  Mes réservations
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<SecurityIcon />}
                  onClick={onEditPassword}
                  fullWidth
                  sx={{
                    transition: "all 0.3s ease-in-out",
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(244, 67, 54, 0.3)',
                    }
                  }}
                >
                  Changer de mot de passe
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsPanel; 