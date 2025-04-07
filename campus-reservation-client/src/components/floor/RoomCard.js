import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Badge,
  Stack,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  MeetingRoom as RoomIcon,
  People as PeopleIcon,
  CheckCircle as CheckIcon,
  DoNotDisturb as CloseIcon,
  Computer as ComputerIcon,
  Videocam as VideocamIcon,
  Wifi as WifiIcon,
  AcUnit as AcUnitIcon,
  BlurOn as BlurOnIcon,
} from "@mui/icons-material";

// Room image generator based on room properties
const getRoomImage = (room) => {
  // Generate a dynamic gradient background based on the room type
  let gradientColors;

  switch (room.roomType?.toLowerCase()) {
    case "classroom":
      gradientColors = "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)";
      break;
    case "computer lab":
      gradientColors = "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)";
      break;
    case "meeting room":
      gradientColors = "linear-gradient(120deg, #f6d365 0%, #fda085 100%)";
      break;
    case "lecture hall":
      gradientColors = "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)";
      break;
    default:
      gradientColors = "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)";
  }

  // Create SVG dynamically
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="140" viewBox="0 0 300 140">
      <defs>
        <style>
          .bg { fill: ${gradientColors ? "url(#gradient)" : "#f0f0f0"}; }
          .room-icon { font-family: sans-serif; font-size: 36px; fill: rgba(255,255,255,0.8); }
          .room-text { font-family: sans-serif; font-size: 14px; fill: rgba(255,255,255,0.9); }
        </style>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${
            gradientColors ? "#a1c4fd" : "#f0f0f0"
          }" />
          <stop offset="100%" stop-color="${
            gradientColors ? "#c2e9fb" : "#d0d0d0"
          }" />
        </linearGradient>
      </defs>
      <rect class="bg" width="300" height="140" />
      <text class="room-icon" x="150" y="65" text-anchor="middle">${
        room.roomType ? room.roomType.charAt(0).toUpperCase() : "R"
      }</text>
      <text class="room-text" x="150" y="90" text-anchor="middle">${
        room.name
      }</text>
      <text class="room-text" x="150" y="110" text-anchor="middle">Capacity: ${
        room.capacity
      }</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Map equipment to icons
const getEquipmentIcon = (equipment) => {
  const equipmentLower = equipment.toLowerCase();
  if (equipmentLower.includes("computer") || equipmentLower.includes("pc"))
    return <ComputerIcon fontSize="small" />;
  if (equipmentLower.includes("projector") || equipmentLower.includes("video"))
    return <VideocamIcon fontSize="small" />;
  if (equipmentLower.includes("wifi") || equipmentLower.includes("internet"))
    return <WifiIcon fontSize="small" />;
  if (equipmentLower.includes("air") || equipmentLower.includes("climate"))
    return <AcUnitIcon fontSize="small" />;
  return <BlurOnIcon fontSize="small" />;
};

const RoomCard = ({ room, floorNumber }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/room/${floorNumber}/${room.id}`);
  };

  const isAvailable = room.status === "available";

  // Calculate capacity utilization (random for demo)
  const utilization = Math.floor(Math.random() * 100);
  const utilizationColor =
    utilization < 30 ? "success" : utilization < 70 ? "warning" : "error";

  return (
    <Badge
      color={isAvailable ? "success" : "error"}
      badgeContent={
        isAvailable ? (
          <Tooltip title="Available">
            <CheckIcon />
          </Tooltip>
        ) : (
          <Tooltip title="Reserved">
            <CloseIcon />
          </Tooltip>
        )
      }
      overlap="circular"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Card
        sx={{
          height: "100%",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "5px",
            backgroundColor: isAvailable ? "success.main" : "error.main",
            zIndex: 1,
          },
        }}
      >
        <CardActionArea onClick={handleClick} sx={{ height: "100%" }}>
          <CardMedia
            component="img"
            height="140"
            image={getRoomImage(room)}
            alt={`Room ${room.name}`}
          />
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                }}
              >
                {room.name}
              </Typography>
              <Chip
                size="small"
                color={isAvailable ? "success" : "error"}
                label={isAvailable ? "Available" : "Reserved"}
                sx={{ fontWeight: 500 }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PeopleIcon
                fontSize="small"
                sx={{ mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" sx={{ mr: 1.5 }}>
                {room.capacity}
              </Typography>

              {room.roomType && (
                <Chip
                  label={room.roomType}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ ml: "auto" }}
                />
              )}
            </Box>

            {/* Utilization indicator */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Typical utilization
              </Typography>
              <LinearProgress
                variant="determinate"
                value={utilization}
                color={utilizationColor}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            {room.equipments && room.equipments.length > 0 && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {room.equipments.map((equipment, index) => (
                  <Tooltip key={index} title={equipment}>
                    <Chip
                      icon={getEquipmentIcon(equipment)}
                      label={equipment}
                      size="small"
                      variant="outlined"
                      sx={{ m: 0.3 }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Badge>
  );
};

export default RoomCard;
