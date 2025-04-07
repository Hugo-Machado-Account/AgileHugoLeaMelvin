import React from "react";
import { Box, Container, Typography, Link, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Campus Reservation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Système de réservation de salles pour votre campus
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Liens rapides
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block">
              Accueil
            </Link>
            <Link
              component={RouterLink}
              to="/dashboard"
              color="inherit"
              display="block"
            >
              Tableau de bord
            </Link>
            <Link
              component={RouterLink}
              to="/my-reservations"
              color="inherit"
              display="block"
            >
              Mes réservations
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Campus Universitaire
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: contact@campus-reservation.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Téléphone: +33 1 23 45 67 89
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link component={RouterLink} to="/" color="inherit">
              Campus Reservation
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
