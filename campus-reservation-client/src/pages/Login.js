import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la connexion"
      );
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={12}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "white",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Header avec gradient */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
              p: 4,
              textAlign: "center",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <BusinessIcon sx={{ fontSize: 48, color: "#60a5fa" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              CAMPUS
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontWeight: 400,
              }}
            >
              Connectez-vous à votre espace
            </Typography>
          </Box>

          {/* Formulaire */}
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    fontWeight: 500,
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nom d'utilisateur"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3730a3",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3730a3",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3730a3",
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: "#64748b" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3730a3",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3730a3",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3730a3",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#1e3a8a",
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  mb: 3,
                  "&:hover": {
                    backgroundColor: "#1e40af",
                    transform: "translateY(-1px)",
                    boxShadow: "0 10px 25px rgba(30, 58, 138, 0.3)",
                  },
                  "&:disabled": {
                    backgroundColor: "#94a3b8",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </Button>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Link 
                    component={RouterLink} 
                    to="#" 
                    sx={{
                      color: "#3730a3",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Mot de passe oublié?
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: { sm: "right" } }}>
                  <Link 
                    component={RouterLink} 
                    to="/register"
                    sx={{
                      color: "#3730a3",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Créer un compte
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              backgroundColor: "#f8fafc",
              p: 3,
              textAlign: "center",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.85rem",
              }}
            >
              En vous connectant, vous acceptez nos{" "}
              <Link
                href="#"
                sx={{
                  color: "#3730a3",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                conditions d'utilisation
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
