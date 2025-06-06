import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Chip,
  FormHelperText,
  Card,
  CardContent,
  Avatar,
  Fade,
  InputAdornment,
  Zoom,
  Slide,
  Grow,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Notes as NotesIcon,
  CheckCircle as CheckCircleIcon,
  EventAvailable as EventAvailableIcon,
  People as PeopleIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Celebration as CelebrationIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { floorService, reservationService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";

// Fonction pour générer les créneaux horaires disponibles
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const ReservationForm = () => {
  const { floorNumber, roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [floor, setFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Données du formulaire
  const [formData, setFormData] = useState({
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    purpose: "",
    notes: "",
  });

  // Erreurs de validation
  const [validationErrors, setValidationErrors] = useState({});

  // Étapes du formulaire
  const steps = [
    { 
      label: "Informations", 
      description: "Décrivez l'objet de votre réservation",
      icon: <DescriptionIcon />
    },
    { 
      label: "Planning", 
      description: "Sélectionnez la date et l'heure",
      icon: <ScheduleIcon />
    },
    { 
      label: "Confirmation", 
      description: "Finalisez votre réservation",
      icon: <CheckCircleIcon />
    }
  ];

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const floorData = await floorService.getFloorByNumber(floorNumber);
        setFloor(floorData);
        
        const roomsData = await floorService.getRoomsByFloor(floorNumber);
        const roomData = roomsData.find((r) => r.id === roomId);

        if (!roomData) {
          throw new Error("Salle non trouvée");
        }

        if (roomData.status !== "available") {
          throw new Error("Cette salle est déjà réservée pour aujourd'hui");
        }

        setRoom(roomData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Une erreur est survenue lors du chargement des données");
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [floorNumber, roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
    if (validationErrors.date) {
      setValidationErrors((prev) => ({ ...prev, date: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.date < today) {
      errors.date = "La date ne peut pas être dans le passé";
    }

    if (formData.startTime >= formData.endTime) {
      errors.endTime = "L'heure de fin doit être après l'heure de début";
    }

    if (!formData.purpose.trim()) {
      errors.purpose = "L'objet de la réservation est requis";
    } else if (formData.purpose.trim().length < 5) {
      errors.purpose = "L'objet doit contenir au moins 5 caractères";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.purpose.trim()) {
        setValidationErrors({ purpose: "L'objet de la réservation est requis" });
        return;
      }
    } else if (activeStep === 1) {
      if (!validateForm()) {
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const reservationData = {
        roomId,
        floorNumber: Number(floorNumber),
        date: formData.date.toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose.trim(),
        notes: formData.notes.trim(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      };

      await reservationService.createReservation(reservationData);
      setSuccess(true);
      setSubmitting(false);

      setTimeout(() => {
        navigate("/my-reservations");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de la création de la réservation");
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #60a5fa 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)",
            backgroundSize: "80px 80px",
            animation: "pulse 4s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 0.3 },
              "50%": { opacity: 0.7 },
            },
          }}
        />
        
        <Card
          elevation={0}
          sx={{
            p: 8,
            borderRadius: 6,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            textAlign: "center",
            maxWidth: 400,
            boxShadow: "0 32px 64px rgba(0,0,0,0.2)",
          }}
        >
          <CircularProgress 
            size={80} 
            thickness={4}
            sx={{ 
              color: "#1e3a8a",
              mb: 4,
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
            Chargement
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Préparation de votre espace de réservation...
          </Typography>
        </Card>
      </Box>
    );
  }

  if (error && !room) {
    return (
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="md">
          <Card 
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: "center",
              border: "1px solid #fca5a5",
              background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 3,
                backgroundColor: "#dc2626",
              }}
            >
              <InfoIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#dc2626", mb: 2 }}>
              Erreur
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", mb: 4 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/floor/${floorNumber}`)}
              sx={{
                background: "#dc2626",
                "&:hover": { 
                  background: "#b91c1c",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(220, 38, 38, 0.3)",
                },
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
              }}
            >
              Retour à l'étage {floorNumber}
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  if (success) {
    return (
      <Box 
        sx={{ 
          minHeight: "100vh",
          background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 3px, transparent 3px)",
            backgroundSize: "100px 100px",
            animation: "celebrate 6s linear infinite",
            "@keyframes celebrate": {
              "0%": { transform: "translateY(0px) rotate(0deg)" },
              "100%": { transform: "translateY(-100px) rotate(360deg)" },
            },
          }}
        />
        
        <Card
          elevation={0}
          sx={{
            p: 8,
            borderRadius: 6,
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            textAlign: "center",
            maxWidth: 600,
            boxShadow: "0 32px 64px rgba(0,0,0,0.15)",
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 4,
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
            }}
          >
            <CelebrationIcon sx={{ fontSize: 60 }} />
          </Avatar>
          
          <Typography variant="h2" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
            🎉 Succès !
          </Typography>
          
          <Typography variant="h5" sx={{ color: "#64748b", mb: 6 }}>
            Votre réservation a été confirmée avec succès
          </Typography>
          
          <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
            <Button 
              variant="contained"
              size="large"
              onClick={() => navigate("/my-reservations")}
              sx={{
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                "&:hover": { 
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 30px rgba(16, 185, 129, 0.4)",
                },
                borderRadius: 4,
                textTransform: "none",
                fontWeight: 700,
                px: 6,
                py: 2,
                fontSize: "1.1rem",
              }}
            >
              Voir mes réservations
            </Button>
            
            <Button 
              variant="outlined"
              size="large"
              onClick={() => navigate("/dashboard")}
              sx={{
                borderColor: "#059669",
                color: "#059669",
                borderWidth: 2,
                "&:hover": { 
                  backgroundColor: "rgba(5, 150, 105, 0.1)",
                  borderColor: "#10b981",
                  transform: "translateY(-3px)",
                },
                borderRadius: 4,
                textTransform: "none",
                fontWeight: 700,
                px: 6,
                py: 2,
              }}
            >
              Nouvelle réservation
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Navigation */}
        <Fade in={true} timeout={600}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              background: "white",
              border: "1px solid #e2e8f0",
            }}
          >
            <Breadcrumbs>
              <Link
                color="inherit"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                }}
                sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  color: "#64748b",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": { color: "#1e3a8a" },
                }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Accueil
              </Link>
              <Link
                color="inherit"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/floor/${floorNumber}`);
                }}
                sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  color: "#64748b",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": { color: "#1e3a8a" },
                }}
              >
                <BusinessIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Étage {floorNumber}
              </Link>
              <Typography
                sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  color: "#1e3a8a",
                  fontWeight: 600,
                }}
              >
                <EventIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Réservation
              </Typography>
            </Breadcrumbs>
          </Card>
        </Fade>

        <Grid container spacing={4}>
          {/* Informations de la salle */}
          <Grid item xs={12} md={4}>
            <Slide in={true} direction="right" timeout={800}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: "white",
                  border: "1px solid #e2e8f0",
                  height: "fit-content",
                  position: "sticky",
                  top: 24,
                }}
              >
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 3,
                      background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
                      boxShadow: "0 12px 25px rgba(30, 58, 138, 0.3)",
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 36 }} />
                  </Avatar>
                  
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
                    Salle {room?.name}
                  </Typography>
                  
                  <Chip
                    label={`${floor?.name} • Étage ${floorNumber}`}
                    sx={{
                      background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
                      color: "white",
                      fontWeight: 600,
                      mb: 3,
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}>
                    Informations
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PeopleIcon sx={{ color: "#3730a3", mr: 2 }} />
                    <Typography variant="body1" sx={{ color: "#64748b" }}>
                      Capacité: {room?.capacity} personnes
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CheckCircleIcon sx={{ color: "#10b981", mr: 2 }} />
                    <Typography variant="body1" sx={{ color: "#64748b" }}>
                      Disponible aujourd'hui
                    </Typography>
                  </Box>
                </Box>

                {/* Horaires d'ouverture */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", mb: 2 }}>
                    Horaires d'ouverture
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Lundi - Vendredi: 8h00 - 20h00
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Créneaux de 30 minutes
                  </Typography>
                </Box>
              </Card>
            </Slide>
          </Grid>

          {/* Formulaire */}
          <Grid item xs={12} md={8}>
            <Slide in={true} direction="left" timeout={800}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  background: "white",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
                    color: "white",
                    p: 6,
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 3,
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <EventAvailableIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                    Nouvelle réservation
                  </Typography>
                  
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Réservez votre espace en quelques étapes simples
                  </Typography>
                </Box>

                <Box sx={{ p: 6 }}>
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 4,
                        borderRadius: 3,
                        border: "1px solid #fca5a5",
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  {/* Stepper moderne */}
                  <Box sx={{ mb: 6 }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel
                            StepIconComponent={() => (
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: index <= activeStep ? "#1e3a8a" : "#e2e8f0",
                                  color: index <= activeStep ? "white" : "#64748b",
                                  transition: "all 0.3s ease",
                                  boxShadow: index <= activeStep ? "0 4px 12px rgba(30, 58, 138, 0.3)" : "none",
                                }}
                              >
                                {step.icon}
                              </Box>
                            )}
                          >
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: index === activeStep ? 700 : 500,
                                color: index <= activeStep ? "#1e3a8a" : "#64748b",
                              }}
                            >
                              {step.label}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                              {step.description}
                            </Typography>
                          </StepLabel>
                          
                          <StepContent>
                            <Box sx={{ py: 3 }}>
                              {/* Étape 1: Informations */}
                              {index === 0 && activeStep === 0 && (
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    <TextField
                                      required
                                      fullWidth
                                      label="Objet de la réservation"
                                      name="purpose"
                                      value={formData.purpose}
                                      onChange={handleChange}
                                      error={!!validationErrors.purpose}
                                      helperText={validationErrors.purpose || "Décrivez l'objet de votre réservation"}
                                      placeholder="Ex: Réunion équipe, Formation, Cours..."
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <DescriptionIcon sx={{ color: "#3730a3" }} />
                                          </InputAdornment>
                                        ),
                                      }}
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: 3,
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
                                  </Grid>
                                  
                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      label="Notes supplémentaires (optionnel)"
                                      name="notes"
                                      value={formData.notes}
                                      onChange={handleChange}
                                      multiline
                                      rows={4}
                                      placeholder="Équipements nécessaires, nombre de participants..."
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 2 }}>
                                            <NotesIcon sx={{ color: "#3730a3" }} />
                                          </InputAdornment>
                                        ),
                                      }}
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: 3,
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
                                  </Grid>
                                </Grid>
                              )}

                              {/* Étape 2: Planning */}
                              {index === 1 && activeStep === 1 && (
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      type="date"
                                      label="Date de réservation"
                                      name="date"
                                      value={formData.date ? formData.date.toISOString().split("T")[0] : ""}
                                      onChange={(e) => {
                                        const newDate = new Date(e.target.value);
                                        handleDateChange(newDate);
                                      }}
                                      InputLabelProps={{ shrink: true }}
                                      fullWidth
                                      required
                                      error={!!validationErrors.date}
                                      helperText={validationErrors.date}
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <CalendarTodayIcon sx={{ color: "#3730a3" }} />
                                          </InputAdornment>
                                        ),
                                      }}
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: 3,
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
                                  </Grid>
                                  
                                  <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                      <InputLabel>Heure de début</InputLabel>
                                      <Select
                                        name="startTime"
                                        value={formData.startTime}
                                        label="Heure de début"
                                        onChange={handleChange}
                                        sx={{
                                          borderRadius: 3,
                                          "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#3730a3",
                                          },
                                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#3730a3",
                                          },
                                        }}
                                      >
                                        {TIME_SLOTS.map((slot) => (
                                          <MenuItem key={slot} value={slot}>
                                            {slot}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  
                                  <Grid item xs={12} md={3}>
                                    <FormControl fullWidth error={!!validationErrors.endTime}>
                                      <InputLabel>Heure de fin</InputLabel>
                                      <Select
                                        name="endTime"
                                        value={formData.endTime}
                                        label="Heure de fin"
                                        onChange={handleChange}
                                        sx={{
                                          borderRadius: 3,
                                          "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#3730a3",
                                          },
                                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#3730a3",
                                          },
                                        }}
                                      >
                                        {TIME_SLOTS.map((slot) => (
                                          <MenuItem
                                            key={slot}
                                            value={slot}
                                            disabled={slot <= formData.startTime}
                                          >
                                            {slot}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {validationErrors.endTime && (
                                        <FormHelperText>{validationErrors.endTime}</FormHelperText>
                                      )}
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              )}

                              {/* Étape 3: Confirmation */}
                              {index === 2 && activeStep === 2 && (
                                <Box>
                                  <Card
                                    elevation={0}
                                    sx={{
                                      p: 4,
                                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                                      borderRadius: 3,
                                      border: "1px solid #e2e8f0",
                                    }}
                                  >
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 3 }}>
                                      Récapitulatif de votre réservation
                                    </Typography>
                                    
                                    <Grid container spacing={3}>
                                      <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#64748b", mb: 1 }}>
                                            Salle
                                          </Typography>
                                          <Typography variant="h6" sx={{ color: "#1e293b" }}>
                                            {room?.name} - {floor?.name}
                                          </Typography>
                                        </Box>
                                        
                                        <Box sx={{ mb: 3 }}>
                                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#64748b", mb: 1 }}>
                                            Date et heure
                                          </Typography>
                                          <Typography variant="h6" sx={{ color: "#1e293b" }}>
                                            {formatDate(formData.date)}
                                          </Typography>
                                          <Typography variant="body1" sx={{ color: "#64748b" }}>
                                            {formData.startTime} - {formData.endTime}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      
                                      <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#64748b", mb: 1 }}>
                                            Objet
                                          </Typography>
                                          <Typography variant="h6" sx={{ color: "#1e293b" }}>
                                            {formData.purpose}
                                          </Typography>
                                        </Box>
                                        
                                        {formData.notes && (
                                          <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#64748b", mb: 1 }}>
                                              Notes
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "#64748b" }}>
                                              {formData.notes}
                                            </Typography>
                                          </Box>
                                        )}
                                        
                                        <Box>
                                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#64748b", mb: 1 }}>
                                            Réservé par
                                          </Typography>
                                          <Typography variant="h6" sx={{ color: "#1e293b" }}>
                                            {user?.firstName} {user?.lastName}
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                                            {user?.email}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Card>
                                </Box>
                              )}

                              {/* Boutons de navigation */}
                              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                                {activeStep === 0 ? (
                                  <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate(`/room/${floorNumber}/${roomId}`)}
                                    sx={{
                                      borderColor: "#cbd5e1",
                                      color: "#64748b",
                                      borderRadius: 3,
                                      textTransform: "none",
                                      fontWeight: 600,
                                      "&:hover": {
                                        borderColor: "#1e3a8a",
                                        color: "#1e3a8a",
                                      },
                                    }}
                                  >
                                    Annuler
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleBack}
                                    sx={{
                                      borderColor: "#cbd5e1",
                                      color: "#64748b",
                                      borderRadius: 3,
                                      textTransform: "none",
                                      fontWeight: 600,
                                      "&:hover": {
                                        borderColor: "#1e3a8a",
                                        color: "#1e3a8a",
                                      },
                                    }}
                                  >
                                    Retour
                                  </Button>
                                )}

                                {activeStep === steps.length - 1 ? (
                                  <Button
                                    variant="contained"
                                    endIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    sx={{
                                      background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
                                      "&:hover": !submitting ? {
                                        background: "linear-gradient(135deg, #3730a3 0%, #1e3a8a 100%)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 8px 25px rgba(30, 58, 138, 0.3)",
                                      } : {},
                                      borderRadius: 3,
                                      textTransform: "none",
                                      fontWeight: 700,
                                      px: 4,
                                      py: 1.5,
                                      minWidth: 180,
                                    }}
                                  >
                                    {submitting ? "Réservation..." : "Confirmer"}
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={handleNext}
                                    sx={{
                                      background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
                                      "&:hover": {
                                        background: "linear-gradient(135deg, #3730a3 0%, #1e3a8a 100%)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 8px 25px rgba(30, 58, 138, 0.3)",
                                      },
                                      borderRadius: 3,
                                      textTransform: "none",
                                      fontWeight: 700,
                                      px: 4,
                                      py: 1.5,
                                    }}
                                  >
                                    Suivant
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                </Box>
              </Card>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ReservationForm;
