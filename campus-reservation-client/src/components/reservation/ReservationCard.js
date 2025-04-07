import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import {
  EventAvailable as EventIcon,
  Room as RoomIcon,
  AccessTime as AccessTimeIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const ReservationCard = ({ reservation, onDelete, showActions = true }) => {
  const navigate = useNavigate();

  // Formater la date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Formater l'état de la réservation
  const getStatusChip = (status) => {
    switch (status) {
      case "confirmed":
        return <Chip size="small" color="success" label="Confirmée" />;
      case "pending":
        return <Chip size="small" color="warning" label="En attente" />;
      case "cancelled":
        return <Chip size="small" color="error" label="Annulée" />;
      default:
        return <Chip size="small" color="primary" label="Non défini" />;
    }
  };

  // Naviguer vers les détails de la salle
  const handleViewRoom = () => {
    navigate(`/room/${reservation.floorNumber}/${reservation.roomId}`);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EventIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {formatDate(reservation.date)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <RoomIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                Salle {reservation.roomId} (Étage {reservation.floorNumber})
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AccessTimeIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                {reservation.startTime} - {reservation.endTime}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Objet:</strong> {reservation.purpose}
            </Typography>

            {reservation.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Notes:</strong> {reservation.notes}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>{getStatusChip(reservation.status)}</Box>

              {showActions && (
                <Box sx={{ display: "flex", mt: 2 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={handleViewRoom}
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(reservation)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
