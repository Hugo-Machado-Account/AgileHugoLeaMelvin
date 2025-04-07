import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { Apartment as ApartmentIcon } from "@mui/icons-material";

// Floor selector with two display modes: dropdown or grid
const FloorSelector = ({
  floors = [],
  selectedFloor,
  setSelectedFloor,
  displayMode = "dropdown",
}) => {
  const navigate = useNavigate();

  const handleFloorChange = (event) => {
    const floorNumber = event.target.value;
    setSelectedFloor(floorNumber);
  };

  const handleFloorClick = (floorNumber) => {
    navigate(`/floor/${floorNumber}`);
  };

  if (displayMode === "dropdown") {
    return (
      <FormControl fullWidth>
        <InputLabel id="floor-select-label">Select Floor</InputLabel>
        <Select
          labelId="floor-select-label"
          id="floor-select"
          value={selectedFloor || ""}
          label="Select Floor"
          onChange={handleFloorChange}
        >
          {floors.map((floor) => (
            <MenuItem key={floor.floorNumber} value={floor.floorNumber}>
              {floor.name} (Floor {floor.floorNumber})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  } else if (displayMode === "grid") {
    return (
      <Grid container spacing={3}>
        {floors.map((floor) => (
          <Grid item xs={12} sm={6} md={4} key={floor.floorNumber}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                onClick={() => handleFloorClick(floor.floorNumber)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`/api/placeholder/400/140?text=Floor ${floor.floorNumber}`}
                  alt={`Floor ${floor.floorNumber}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {floor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Floor {floor.floorNumber}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <ApartmentIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {floor.elements?.filter((e) => e.type === "room")
                        .length || 0}{" "}
                      rooms
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return null;
};

export default FloorSelector;
