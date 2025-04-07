import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import frLocale from "date-fns/locale/fr";
import {
  Home as HomeIcon,
  Room as RoomIcon,
  Event as EventIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { floorService, reservationService } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

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
  const steps = ["Informations", "Date et heure", "Confirmation"];

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);

        // Récupérer les informations de l'étage
        const floorData = await floorService.getFloorByNumber(floorNumber);
        setFloor(floorData);

        // Récupérer la salle spécifique
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
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des données"
        );
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [floorNumber, roomId]);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Gérer le changement de date
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date,
    }));

    // Effacer l'erreur de validation pour la date
    if (validationErrors.date) {
      setValidationErrors((prev) => ({
        ...prev,
        date: null,
      }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};

    // Valider la date (pas dans le passé)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.date < today) {
      errors.date = "La date ne peut pas être dans le passé";
    }

    // Valider les heures (début avant fin)
    if (formData.startTime >= formData.endTime) {
      errors.endTime = "L'heure de fin doit être après l'heure de début";
    }

    // Valider l'objet de la réservation
    if (!formData.purpose.trim()) {
      errors.purpose = "L'objet de la réservation est requis";
    } else if (formData.purpose.trim().length < 5) {
      errors.purpose = "L'objet doit contenir au moins 5 caractères";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gérer les étapes
  const handleNext = () => {
    if (activeStep === 0) {
      // Valider l'objet de la réservation
      if (!formData.purpose.trim()) {
        setValidationErrors({
          purpose: "L'objet de la réservation est requis",
        });
        return;
      }
    } else if (activeStep === 1) {
      // Valider la date et les heures
      if (!validateForm()) {
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Préparer les données de réservation
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

      // Créer la réservation
      await reservationService.createReservation(reservationData);

      setSuccess(true);
      setSubmitting(false);

      // Rediriger vers la page des réservations après 2 secondes
      setTimeout(() => {
        navigate("/my-reservations");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la création de la réservation"
      );
      setSubmitting(false);
    }
  };

  // Formatage de date pour affichage
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
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement des informations de la salle...
        </Typography>
      </Container>
    );
  }

  if (error && !room) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/floor/${floorNumber}`)}
        >
          Retour à l'étage {floorNumber}
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Votre réservation a été créée avec succès. Vous allez être redirigé
          vers vos réservations.
        </Alert>
        <Button variant="outlined" onClick={() => navigate("/my-reservations")}>
          Voir mes réservations
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
          sx={{ display: "flex", alignItems: "center" }}
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
          sx={{ display: "flex", alignItems: "center" }}
        >
          <RoomIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Étage {floorNumber}
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/room/${floorNumber}/${roomId}`);
          }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          Salle {room?.name}
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <EventIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Réservation
        </Typography>
      </Breadcrumbs>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Réserver une salle
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Salle {room?.name} - {floor?.name} (Étage {floorNumber})
        </Typography>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ width: "100%", my: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de la réservation
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="purpose"
                name="purpose"
                label="Objet de la réservation"
                value={formData.purpose}
                onChange={handleChange}
                error={!!validationErrors.purpose}
                helperText={validationErrors.purpose}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes supplémentaires"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(`/room/${floorNumber}/${roomId}`)}
                >
                  Annuler
                </Button>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleNext}
                >
                  Suivant
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Date et horaires
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={frLocale}
              >
                <DatePicker
                  label="Date de réservation"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!validationErrors.date}
                      helperText={validationErrors.date}
                    />
                  )}
                  disablePast
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="startTime-label">Heure de début</InputLabel>
                  <Select
                    labelId="startTime-label"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    label="Heure de début"
                    onChange={handleChange}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth error={!!validationErrors.endTime}>
                  <InputLabel id="endTime-label">Heure de fin</InputLabel>
                  <Select
                    labelId="endTime-label"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    label="Heure de fin"
                    onChange={handleChange}
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
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                >
                  Retour
                </Button>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleNext}
                >
                  Suivant
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Confirmation de la réservation
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Salle</Typography>
                    <Typography variant="body1" gutterBottom>
                      {room?.name}
                    </Typography>

                    <Typography variant="subtitle2">Étage</Typography>
                    <Typography variant="body1" gutterBottom>
                      {floor?.name} (Étage {floorNumber})
                    </Typography>

                    <Typography variant="subtitle2">Capacité</Typography>
                    <Typography variant="body1" gutterBottom>
                      {room?.capacity} personnes
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Date</Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(formData.date)}
                    </Typography>

                    <Typography variant="subtitle2">Horaires</Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.startTime} - {formData.endTime}
                    </Typography>

                    <Typography variant="subtitle2">Réservé par</Typography>
                    <Typography variant="body1" gutterBottom>
                      {user?.firstName} {user?.lastName} ({user?.email})
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Objet</Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.purpose}
                    </Typography>

                    {formData.notes && (
                      <>
                        <Typography variant="subtitle2">Notes</Typography>
                        <Typography variant="body1" gutterBottom>
                          {formData.notes}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                >
                  Retour
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting
                    ? "Réservation en cours..."
                    : "Confirmer la réservation"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default ReservationForm;
