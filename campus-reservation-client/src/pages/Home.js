import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
  Divider,
} from "@mui/material";
import {
  Event as EventIcon,
  Room as RoomIcon,
  DateRange as DateRangeIcon,
  PersonOutline as PersonOutlineIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Liste des fonctionnalités
  const features = [
    {
      title: "Réservation Facile",
      description:
        "Réservez des salles en quelques clics à travers une interface intuitive.",
      icon: <EventIcon fontSize="large" color="primary" />,
    },
    {
      title: "Vue d'Étage",
      description:
        "Visualisez les salles disponibles par étage avec leurs caractéristiques.",
      icon: <RoomIcon fontSize="large" color="primary" />,
    },
    {
      title: "Gestion des Réservations",
      description:
        "Gérez toutes vos réservations à venir et passées en un seul endroit.",
      icon: <DateRangeIcon fontSize="large" color="primary" />,
    },
    {
      title: "Profil Utilisateur",
      description:
        "Personnalisez votre profil et accédez à votre historique de réservations.",
      icon: <PersonOutlineIcon fontSize="large" color="primary" />,
    },
  ];

  return (
    <>
      {/* Section Hero */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                color="inherit"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Réservation de Salles Campus
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Une solution simple et efficace pour la gestion et la
                réservation des salles de votre campus. Trouvez et réservez la
                salle parfaite pour vos cours, réunions ou événements en
                quelques clics.
              </Typography>
              <Box sx={{ mt: 4 }}>
                {isAuthenticated ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate("/dashboard")}
                    sx={{ mr: 2 }}
                  >
                    Tableau de bord
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => navigate("/login")}
                      sx={{ mr: 2 }}
                    >
                      Connexion
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      onClick={() => navigate("/register")}
                    >
                      Inscription
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                sx={{
                  width: "100%",
                  maxHeight: 400,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
                alt="Campus illustration"
                src="/api/placeholder/600/400?text=Campus+Reservation"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Fonctionnalités */}
      <Container sx={{ py: 8 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Fonctionnalités
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Notre application offre tout ce dont vous avez besoin pour gérer
          efficacement vos réservations de salles.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    align="center"
                  >
                    {feature.title}
                  </Typography>
                  <Typography align="center">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Section Comment ça marche */}
      <Box sx={{ bgcolor: "grey.100", py: 8 }}>
        <Container>
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Comment ça marche
          </Typography>

          <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    1. Connectez-vous
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      height: 140,
                      width: 140,
                      mb: 2,
                    }}
                    alt="Connexion"
                    src="/api/placeholder/140/140?text=Login"
                  />
                  <Typography>
                    Créez un compte ou connectez-vous pour accéder à toutes les
                    fonctionnalités de l'application.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    2. Trouvez une salle
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      height: 140,
                      width: 140,
                      mb: 2,
                    }}
                    alt="Recherche de salle"
                    src="/api/placeholder/140/140?text=Search"
                  />
                  <Typography>
                    Parcourez les étages, filtrez par disponibilité ou par
                    caractéristiques pour trouver la salle idéale.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    3. Réservez
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      height: 140,
                      width: 140,
                      mb: 2,
                    }}
                    alt="Réservation"
                    src="/api/placeholder/140/140?text=Book"
                  />
                  <Typography>
                    Sélectionnez la date, l'heure et confirmez votre réservation
                    en quelques secondes.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Section Appel à l'action */}
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Prêt à commencer ?
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Rejoignez notre plateforme dès maintenant et simplifiez la gestion de
          vos réservations de salles.
        </Typography>
        <Box sx={{ mt: 4 }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/dashboard")}
            >
              Accéder au tableau de bord
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/register")}
            >
              S'inscrire gratuitement
            </Button>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
