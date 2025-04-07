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
  Stepper,
  Step,
  StepLabel,
  Fade,
  Grow,
  Card,
  CardContent,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Home as HomeIcon,
  Room as RoomIcon,
  Event as EventIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarMonthIcon,
  Subject as SubjectIcon,
  Notes as NotesIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { floorService, reservationService } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

// Function to generate available time slots
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
  const theme = useTheme();
  const [room, setRoom] = useState(null);
  const [floor, setFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Form data
  const [formData, setFormData] = useState({
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    purpose: "",
    notes: "",
  });

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Form steps
  const steps = ["Information", "Date and Time", "Confirmation"];

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);

        // Get floor info
        const floorData = await floorService.getFloorByNumber(floorNumber);
        setFloor(floorData);

        // Get specific room
        const roomsData = await floorService.getRoomsByFloor(floorNumber);
        const roomData = roomsData.find((r) => r.id === roomId);

        if (!roomData) {
          throw new Error("Room not found");
        }

        if (roomData.status !== "available") {
          throw new Error("This room is already reserved for today");
        }

        setRoom(roomData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while loading data");
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [floorNumber, roomId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    if (!date) return;

    setFormData((prev) => ({
      ...prev,
      date,
    }));

    // Clear validation error for date
    if (validationErrors.date) {
      setValidationErrors((prev) => ({
        ...prev,
        date: null,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Validate date (not in the past)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.date < today) {
      errors.date = "Date cannot be in the past";
    }

    // Validate times (end must be after start)
    if (formData.startTime >= formData.endTime) {
      errors.endTime = "End time must be after start time";
    }

    // Validate purpose
    if (!formData.purpose.trim()) {
      errors.purpose = "Purpose is required";
    } else if (formData.purpose.trim().length < 5) {
      errors.purpose = "Purpose must be at least 5 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form steps
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate purpose field
      if (!formData.purpose.trim()) {
        setValidationErrors({
          purpose: "Purpose is required",
        });
        return;
      }

      // Clear error if purpose is valid
      setValidationErrors((prev) => ({ ...prev, purpose: null }));

      // Move to next step
      setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 1) {
      // Validate date and times
      if (!validateForm()) {
        return;
      }

      // Move to next step (confirmation)
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Prepare reservation data
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

      // Create reservation
      await reservationService.createReservation(reservationData);

      setSuccess(true);
      setSubmitting(false);

      // Redirect to reservations after 2 seconds
      setTimeout(() => {
        navigate("/my-reservations");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred creating the reservation"
      );
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h5" sx={{ mt: 3, fontWeight: "medium" }}>
          Loading room information...
        </Typography>
      </Container>
    );
  }

  if (error && !room) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{
            borderRadius: 2,
            mb: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/floor/${floorNumber}`)}
        >
          Back to Floor {floorNumber}
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Grow in={true}>
          <Alert
            severity="success"
            icon={<CheckCircleIcon fontSize="large" />}
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              py: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Your reservation has been created successfully!
            </Typography>
            <Typography variant="body1">
              You will be redirected to your reservations.
            </Typography>
          </Alert>
        </Grow>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/my-reservations")}
        >
          View My Reservations
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        sx={{
          mb: 3,
          py: 1.5,
          px: 2,
          borderRadius: 2,
          backgroundColor: "background.paper",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
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
            "&:hover": {
              color: "primary.main",
            },
            transition: "color 0.2s",
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
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
            "&:hover": {
              color: "primary.main",
            },
            transition: "color 0.2s",
          }}
        >
          <RoomIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Floor {floorNumber}
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/room/${floorNumber}/${roomId}`);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            "&:hover": {
              color: "primary.main",
            },
            transition: "color 0.2s",
          }}
        >
          Room {room?.name}
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center", fontWeight: "medium" }}
        >
          <EventIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Reservation
        </Typography>
      </Breadcrumbs>

      <Fade in={true}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            background: `linear-gradient(45deg, ${alpha(
              theme.palette.primary.light,
              0.15
            )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="primary.main"
          >
            Book a Room
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Room {room?.name} • {floor?.name} (Floor {floorNumber})
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                my: 2,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ width: "100%", my: 4 }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                "& .MuiStepLabel-label": {
                  mt: 1,
                },
                "& .MuiStepLabel-iconContainer": {
                  "& .MuiStepIcon-root": {
                    width: "2rem",
                    height: "2rem",
                    "&.Mui-active": {
                      color: "primary.main",
                    },
                    "&.Mui-completed": {
                      color: "success.main",
                    },
                  },
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box>
            {activeStep === 0 && (
              <Fade in={activeStep === 0}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <SubjectIcon sx={{ mr: 1 }} />
                      Reservation Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="purpose"
                      name="purpose"
                      label="Purpose of Reservation"
                      value={formData.purpose}
                      onChange={handleChange}
                      error={!!validationErrors.purpose}
                      helperText={validationErrors.purpose}
                      placeholder="e.g., Team Meeting, Study Group, Training Session"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="notes"
                      name="notes"
                      label="Additional Notes"
                      value={formData.notes}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      placeholder="Any special requirements or information..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between">
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() =>
                          navigate(`/room/${floorNumber}/${roomId}`)
                        }
                        sx={{
                          borderRadius: 10,
                          px: 3,
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleNext}
                        sx={{
                          borderRadius: 10,
                          px: 3,
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Fade>
            )}

            {activeStep === 1 && (
              <Fade in={activeStep === 1}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CalendarMonthIcon sx={{ mr: 1 }} />
                      Date and Time
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Reservation Date"
                        value={formData.date}
                        onChange={handleDateChange}
                        disablePast
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            error={!!validationErrors.date}
                            helperText={validationErrors.date}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormControl
                        fullWidth
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      >
                        <InputLabel id="startTime-label">Start Time</InputLabel>
                        <Select
                          labelId="startTime-label"
                          id="startTime"
                          name="startTime"
                          value={formData.startTime}
                          label="Start Time"
                          onChange={handleChange}
                        >
                          {TIME_SLOTS.map((slot) => (
                            <MenuItem key={slot} value={slot}>
                              {slot}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl
                        fullWidth
                        error={!!validationErrors.endTime}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      >
                        <InputLabel id="endTime-label">End Time</InputLabel>
                        <Select
                          labelId="endTime-label"
                          id="endTime"
                          name="endTime"
                          value={formData.endTime}
                          label="End Time"
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
                          <FormHelperText>
                            {validationErrors.endTime}
                          </FormHelperText>
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
                        sx={{
                          borderRadius: 10,
                          px: 3,
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleNext}
                        sx={{
                          borderRadius: 10,
                          px: 3,
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Fade>
            )}

            {activeStep === 2 && (
              <Fade in={activeStep === 2}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CheckCircleIcon sx={{ mr: 1 }} />
                      Reservation Confirmation
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Room
                              </Typography>
                              <Typography variant="h6">{room?.name}</Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Floor
                              </Typography>
                              <Typography variant="h6">
                                {floor?.name} (Floor {floorNumber})
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Capacity
                              </Typography>
                              <Typography variant="h6">
                                {room?.capacity} people
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Box
                              sx={{
                                mb: 3,
                                display: "flex",
                                alignItems: "flex-start",
                              }}
                            >
                              <CalendarMonthIcon
                                sx={{ mr: 1, color: "primary.main" }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Date
                                </Typography>
                                <Typography variant="h6">
                                  {formatDate(formData.date)}
                                </Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                mb: 3,
                                display: "flex",
                                alignItems: "flex-start",
                              }}
                            >
                              <AccessTimeIcon
                                sx={{ mr: 1, color: "primary.main" }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Time
                                </Typography>
                                <Typography variant="h6">
                                  {formData.startTime} - {formData.endTime}
                                </Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{ display: "flex", alignItems: "flex-start" }}
                            >
                              <PersonIcon
                                sx={{ mr: 1, color: "primary.main" }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Reserved by
                                </Typography>
                                <Typography variant="h6">
                                  {user?.firstName} {user?.lastName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {user?.email}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                          </Grid>

                          <Grid item xs={12}>
                            <Box
                              sx={{ display: "flex", alignItems: "flex-start" }}
                            >
                              <SubjectIcon
                                sx={{ mr: 1, color: "primary.main" }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Purpose
                                </Typography>
                                <Typography variant="h6">
                                  {formData.purpose}
                                </Typography>
                              </Box>
                            </Box>

                            {formData.notes && (
                              <Box
                                sx={{
                                  mt: 3,
                                  display: "flex",
                                  alignItems: "flex-start",
                                }}
                              >
                                <NotesIcon
                                  sx={{ mr: 1, color: "primary.main" }}
                                />
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                  >
                                    Notes
                                  </Typography>
                                  <Typography variant="body1">
                                    {formData.notes}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between">
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                        sx={{
                          borderRadius: 10,
                          px: 3,
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SaveIcon />}
                        onClick={handleSubmit}
                        disabled={submitting}
                        sx={{
                          borderRadius: 10,
                          px: 3,
                        }}
                      >
                        {submitting ? "Reserving..." : "Confirm Reservation"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Fade>
            )}
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default ReservationForm;
