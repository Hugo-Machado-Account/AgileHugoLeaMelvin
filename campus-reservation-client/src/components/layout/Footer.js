import React from "react";
import { Box, Container, Typography, Link, Grid, Divider, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1e293b",
        color: "white",
        mt: "auto",
      }}
    >
      {/* Section principale */}
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Logo et description */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BusinessIcon sx={{ fontSize: 32, mr: 2, color: "#60a5fa" }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  CAMPUS
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "#94a3b8", 
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Plateforme professionnelle de gestion des réservations de salles. 
                Simplifiez vos processus avec une solution moderne et efficace.
              </Typography>
              
              {/* Réseaux sociaux */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  sx={{
                    color: "#94a3b8",
                    "&:hover": {
                      color: "#60a5fa",
                      backgroundColor: "rgba(96, 165, 250, 0.1)",
                    },
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  sx={{
                    color: "#94a3b8",
                    "&:hover": {
                      color: "#60a5fa",
                      backgroundColor: "rgba(96, 165, 250, 0.1)",
                    },
                  }}
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  sx={{
                    color: "#94a3b8",
                    "&:hover": {
                      color: "#60a5fa",
                      backgroundColor: "rgba(96, 165, 250, 0.1)",
                    },
                  }}
                >
                  <TwitterIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Navigation */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  color: "white",
                }}
              >
                Navigation
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link 
                  component={RouterLink} 
                  to="/" 
                  sx={{
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  Accueil
                </Link>
                <Link
                  component={RouterLink}
                  to="/dashboard"
                  sx={{
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  Tableau de bord
                </Link>
                <Link
                  component={RouterLink}
                  to="/my-reservations"
                  sx={{
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  Réservations
                </Link>
                <Link
                  component={RouterLink}
                  to="/profile"
                  sx={{
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  Profil
                </Link>
              </Box>
            </Grid>

            {/* Support */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  color: "white",
                }}
              >
                Support
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link 
                  href="#"
                  sx={{
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  Centre d'aide
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  Documentation
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  Nous contacter
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    "&:hover": {
                      color: "#60a5fa",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  Signaler un bug
                </Link>
              </Box>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} md={3}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  color: "white",
                }}
              >
                Contact
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <LocationIcon sx={{ color: "#60a5fa", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Campus Universitaire<br />
                    75001 Paris, France
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <EmailIcon sx={{ color: "#60a5fa", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    contact@campus-reservation.fr
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <PhoneIcon sx={{ color: "#60a5fa", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    +33 1 23 45 67 89
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ backgroundColor: "#334155" }} />

        {/* Copyright */}
        <Box sx={{ py: 3, textAlign: "center" }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#94a3b8",
              fontSize: "0.9rem",
            }}
          >
            © {new Date().getFullYear()} Campus Reservation. Tous droits réservés.
            {" "}
            <Link 
              href="#"
              sx={{
                color: "#60a5fa",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Politique de confidentialité
            </Link>
            {" "}•{" "}
            <Link
              href="#"
              sx={{
                color: "#60a5fa",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Conditions d'utilisation
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
