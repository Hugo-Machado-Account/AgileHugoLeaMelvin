import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Avatar,
  Fade,
  Grow,
  Slide,
} from "@mui/material";
import {
  Event as EventIcon,
  Room as RoomIcon,
  DateRange as DateRangeIcon,
  PersonOutline as PersonOutlineIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Groups as GroupsIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  SupportAgent as SupportIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    setAnimationTrigger(true);
  }, []);

  // Stats professionnelles
  const stats = [
    { number: "200+", label: "Réservations traitées", icon: <EventIcon /> },
    { number: "10+", label: "Salles disponibles", icon: <RoomIcon /> },
    { number: "100%", label: "Taux de satisfaction", icon: <StarIcon /> },
    { number: "24/7", label: "Support technique", icon: <SupportIcon /> },
  ];

  // Fonctionnalités épurées
  const features = [
    {
      title: "Réservation Simplifiée",
      description: "Interface intuitive pour réserver vos salles en quelques clics. Gain de temps garanti pour tous vos besoins.",
      icon: <SpeedIcon />,
    },
    {
      title: "Gestion Centralisée",
      description: "Visualisez et gérez toutes vos réservations depuis un tableau de bord unifié et professionnel.",
      icon: <RoomIcon />,
    },
    {
      title: "Planification Avancée",
      description: "Outils de planification intelligents avec suggestions automatiques et gestion des conflits.",
      icon: <DateRangeIcon />,
    },
    {
      title: "Analytics & Reporting",
      description: "Rapports détaillés et statistiques d'utilisation pour optimiser la gestion de vos espaces.",
      icon: <TrendingUpIcon />,
    },
  ];

  // Témoignages professionnels
  const testimonials = [
    {
      name: "Dr. Sarah Martin",
      role: "Directrice Pédagogique",
      avatar: "SM",
      comment: "Solution remarquable qui a considérablement optimisé notre gestion des espaces de formation.",
    },
    {
      name: "Pierre Dubois", 
      role: "Responsable Logistique",
      avatar: "PD",
      comment: "Interface parfaitement adaptée à nos besoins. L'efficacité et la simplicité sont au rendez-vous.",
    },
    {
      name: "Marie Leroy",
      role: "Administratrice Campus",
      avatar: "ML",
      comment: "Outil indispensable pour notre établissement. La productivité de notre équipe s'est nettement améliorée.",
    },
  ];

  return (
    <>
      {/* Hero Section - Design Professionnel */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e40af 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={animationTrigger} timeout={800}>
                <Box>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      fontWeight: 700,
                      color: "white",
                      mb: 3,
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Réservation de Salles
                    <br />
                    <span style={{ color: "#60a5fa" }}>Nouvelle Génération</span>
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "rgba(255,255,255,0.85)", 
                      mb: 4, 
                      lineHeight: 1.6,
                      fontWeight: 400,
                      maxWidth: 500,
                    }}
                  >
                    Plateforme professionnelle de gestion des réservations de salles. 
                    Simplifiez vos processus avec une solution moderne et efficace.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {isAuthenticated ? (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/dashboard")}
                        sx={{
                          backgroundColor: "white",
                          color: "#1e3a8a",
                          fontWeight: 600,
                          py: 1.5,
                          px: 4,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                          "&:hover": {
                            backgroundColor: "#f8fafc",
                            transform: "translateY(-1px)",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        Accéder au tableau de bord
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => navigate("/login")}
                          sx={{
                            backgroundColor: "white",
                            color: "#1e3a8a",
                            fontWeight: 600,
                            py: 1.5,
                            px: 4,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "1rem",
                            "&:hover": {
                              backgroundColor: "#f8fafc",
                              transform: "translateY(-1px)",
                              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          Se connecter
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => navigate("/register")}
                          sx={{
                            borderColor: "white",
                            color: "white",
                            py: 1.5,
                            px: 4,
                            borderRadius: 2,
                            borderWidth: 2,
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": {
                              borderColor: "#60a5fa",
                              backgroundColor: "rgba(96, 165, 250, 0.1)",
                              transform: "translateY(-1px)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          Créer un compte
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide direction="left" in={animationTrigger} timeout={1000}>
                <Paper
                  elevation={12}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Typography variant="h5" sx={{ color: "#1e3a8a", mb: 3, fontWeight: 600 }}>
                    Tableau de bord
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {stats.slice(0, 3).map((stat, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          p: 2.5,
                          borderRadius: 2,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Box sx={{ color: "#3730a3" }}>{stat.icon}</Box>
                        <Box>
                          <Typography variant="h6" sx={{ color: "#1e3a8a", fontWeight: 600 }}>
                            {stat.number}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section - Épurée */}
      <Box sx={{ py: 8, backgroundColor: "#f8fafc" }}>
        <Container>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Grow in={animationTrigger} timeout={1000 + index * 150}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: 3,
                      background: "white",
                      border: "1px solid #e2e8f0",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Box sx={{ color: "#3730a3", mb: 2 }}>{stat.icon}</Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#64748b" }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section - Professionnelle */}
      <Container sx={{ py: 10 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 3,
              letterSpacing: "-0.02em",
            }}
          >
            Fonctionnalités
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#64748b", 
              maxWidth: 600, 
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Des outils professionnels conçus pour optimiser la gestion de vos espaces
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Fade in={animationTrigger} timeout={1200 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: 3,
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                      "& .feature-icon": {
                        color: "#3730a3",
                      },
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        color: "#64748b",
                        mb: 3,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "#1e293b" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section - Sobre */}
      <Box sx={{ backgroundColor: "#f8fafc", py: 10 }}>
        <Container>
          <Typography
            variant="h3"
            align="center"
            sx={{
              color: "#1e293b",
              fontWeight: 700,
              mb: 6,
              letterSpacing: "-0.02em",
            }}
          >
            Témoignages
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in={animationTrigger} timeout={1500 + index * 200}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      background: "white",
                      border: "1px solid #e2e8f0",
                      textAlign: "center",
                      height: "100%",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mx: "auto",
                        mb: 3,
                        backgroundColor: "#3730a3",
                        fontSize: "1.25rem",
                        fontWeight: 600,
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Typography variant="body1" sx={{ color: "#1e293b", mb: 3, fontStyle: "italic", lineHeight: 1.6 }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {testimonial.role}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - Épurée */}
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
            borderRadius: 4,
            p: 8,
            color: "white",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 3,
              letterSpacing: "-0.02em",
            }}
          >
            Prêt à commencer ?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.85)",
              mb: 4,
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Rejoignez les établissements qui font confiance à notre solution 
            pour optimiser leur gestion des espaces
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
            sx={{
              backgroundColor: "white",
              color: "#1e3a8a",
              fontWeight: 600,
              py: 2,
              px: 6,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              "&:hover": {
                backgroundColor: "#f8fafc",
                transform: "translateY(-2px)",
                boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isAuthenticated ? "Accéder au tableau de bord" : "Commencer maintenant"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Home;
