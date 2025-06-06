import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { PROFILE_COLORS, COLOR_NAMES } from '../../utils/profileConstants';

const ColorTestPanel = ({ profileData, onColorChange }) => {
  
  const handleTestColor = (color) => {
    console.log('🧪 ColorTestPanel - Test couleur:', color);
    onColorChange(color);
  };

  return (
    <Box sx={{ p: 2, border: '2px dashed #ccc', borderRadius: 1, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        🧪 Test de Changement de Couleur
      </Typography>
      
      <Typography variant="body2" gutterBottom>
        Couleur actuelle: <strong style={{ color: profileData?.preferredColor }}>
          {COLOR_NAMES[profileData?.preferredColor] || 'Non définie'} ({profileData?.preferredColor})
        </strong>
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
        {PROFILE_COLORS.map((color) => (
          <Button
            key={color}
            variant={profileData?.preferredColor === color ? "contained" : "outlined"}
            size="small"
            sx={{
              minWidth: 100,
              bgcolor: profileData?.preferredColor === color ? color : 'transparent',
              borderColor: color,
              color: profileData?.preferredColor === color ? 'white' : color,
              '&:hover': {
                bgcolor: color,
                color: 'white',
              }
            }}
            onClick={() => handleTestColor(color)}
          >
            {COLOR_NAMES[color]}
          </Button>
        ))}
      </Stack>

      <Box 
        sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: profileData?.preferredColor + '22',
          border: `2px solid ${profileData?.preferredColor}`,
          borderRadius: 1,
          transition: 'all 0.3s ease'
        }}
      >
        <Typography variant="caption" display="block">
          Zone de test - Cette zone doit changer de couleur instantanément
        </Typography>
        <Typography variant="body2" sx={{ color: profileData?.preferredColor, fontWeight: 'bold' }}>
          Si cette couleur ne change pas, il y a un problème de propagation !
        </Typography>
      </Box>
    </Box>
  );
};

export default ColorTestPanel; 