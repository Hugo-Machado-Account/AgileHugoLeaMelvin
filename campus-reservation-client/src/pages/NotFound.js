import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { Home as HomeIcon, Search as SearchIcon } from "@mui/icons-material";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ textAlign: "center", p: 5 }}>
        <Typography
          variant="h1"
          color="error"
          sx={{ fontSize: "6rem", fontWeight: "bold" }}
        >
          404
        </Typography>

        <Typography variant="h4" gutterBottom>
          Page non trouvée
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          La page que vous recherchez n'existe pas ou a été déplacée.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
          >
            Retour à l'accueil
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => navigate("/dashboard")}
          >
            Explorer les salles
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
