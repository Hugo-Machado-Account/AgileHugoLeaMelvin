import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MeetingRoom as MeetingRoomIcon,
  Computer as ComputerIcon,
  Tv as TvIcon,
  Wifi as WifiIcon,
  AcUnit as AcUnitIcon,
} from '@mui/icons-material';

const equipmentOptions = [
  { id: 'computer', label: 'Ordinateur', icon: <ComputerIcon /> },
  { id: 'tv', label: 'Télévision', icon: <TvIcon /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <WifiIcon /> },
  { id: 'ac', label: 'Climatisation', icon: <AcUnitIcon /> },
];

const roomTypes = [
  'Classroom',
  'Conference Room',
  'Meeting Room',
  'Laboratory',
  'Office',
];

const RoomCreation = ({ open, onClose, onSubmit, floorNumber }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    description: '',
    equipments: [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleEquipmentToggle = (equipmentId) => {
    setFormData((prev) => ({
      ...prev,
      equipments: prev.equipments.includes(equipmentId)
        ? prev.equipments.filter((id) => id !== equipmentId)
        : [...prev.equipments, equipmentId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.type) newErrors.type = 'Le type est requis';
    if (!formData.capacity) newErrors.capacity = 'La capacité est requise';
    if (formData.capacity && (isNaN(formData.capacity) || formData.capacity <= 0)) {
      newErrors.capacity = 'La capacité doit être un nombre positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        floorNumber,
        status: 'available',
        type: 'room',
      });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MeetingRoomIcon color="primary" />
          <Typography variant="h6">Créer une nouvelle salle</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom de la salle"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Type de salle</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type de salle"
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && (
                <Typography color="error" variant="caption">
                  {errors.type}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Capacité"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              error={!!errors.capacity}
              helperText={errors.capacity}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Équipements
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {equipmentOptions.map((equipment) => (
                <Chip
                  key={equipment.id}
                  label={equipment.label}
                  icon={equipment.icon}
                  onClick={() => handleEquipmentToggle(equipment.id)}
                  color={formData.equipments.includes(equipment.id) ? 'primary' : 'default'}
                  sx={{
                    '&:hover': {
                      backgroundColor: formData.equipments.includes(equipment.id)
                        ? 'primary.dark'
                        : 'action.hover',
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Créer la salle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomCreation; 