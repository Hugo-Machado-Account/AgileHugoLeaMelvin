import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  MeetingRoom as MeetingRoomIcon,
  People as PeopleIcon,
  Computer as ComputerIcon,
  Videocam as VideocamIcon,
  Wifi as WifiIcon,
  AcUnit as AcUnitIcon,
  Circle as CircleIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";

// Map equipment to icons with professional style
const getEquipmentIcon = (equipment) => {
  const equipmentLower = equipment.toLowerCase();
  if (equipmentLower.includes("projecteur") || equipmentLower.includes("projector"))
    return <VideocamIcon sx={{ fontSize: 16 }} />;
  if (equipmentLower.includes("ordinateur") || equipmentLower.includes("computer"))
    return <ComputerIcon sx={{ fontSize: 16 }} />;
  if (equipmentLower.includes("wifi") || equipmentLower.includes("internet"))
    return <WifiIcon sx={{ fontSize: 16 }} />;
  if (equipmentLower.includes("air") || equipmentLower.includes("climat"))
    return <AcUnitIcon sx={{ fontSize: 16 }} />;
  return <CircleIcon sx={{ fontSize: 16 }} />;
};

// Get room type icon and color
const getRoomTypeConfig = (roomType) => {
  switch (roomType?.toLowerCase()) {
    case "classroom":
    case "salle de cours":
      return {
        icon: <SchoolIcon />,
        color: "#3730a3",
        bgColor: "#3730a315",
        label: "Salle de cours"
      };
    case "computer lab":
    case "laboratoire":
      return {
        icon: <ComputerIcon />,
        color: "#059669",
        bgColor: "#05966915",
        label: "Laboratoire"
      };
    case "meeting room":
    case "salle de réunion":
      return {
        icon: <BusinessIcon />,
        color: "#dc2626",
        bgColor: "#dc262615",
        label: "Salle de réunion"
      };
    case "lecture hall":
    case "amphithéâtre":
      return {
        icon: <GroupsIcon />,
        color: "#7c2d12",
        bgColor: "#7c2d1215",
        label: "Amphithéâtre"
      };
    default:
      return {
        icon: <MeetingRoomIcon />,
        color: "#64748b",
        bgColor: "#64748b15",
        label: "Salle"
      };
  }
};

// Get capacity category
const getCapacityCategory = (capacity) => {
  if (capacity <= 20) return { label: "Petite", color: "#059669" };
  if (capacity <= 50) return { label: "Moyenne", color: "#d97706" };
  return { label: "Grande", color: "#dc2626" };
};

const RoomCard = ({ room, floorNumber }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/room/${floorNumber}/${room.id}`);
  };

  const isAvailable = room.status === "available";
  const roomTypeConfig = getRoomTypeConfig(room.roomType);
  const capacityCategory = getCapacityCategory(room.capacity);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        background: "white",
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          "& .room-header": {
            background: isAvailable 
              ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
              : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
          },
        },
        transition: "all 0.2s ease",
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: "100%" }}>
        {/* Header avec statut */}
        <Box
          className="room-header"
          sx={{
            height: 80,
            background: isAvailable 
              ? "linear-gradient(135deg, #3730a3 0%, #1e40af 100%)"
              : "linear-gradient(135deg, #64748b 0%, #475569 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            position: "relative",
            transition: "all 0.2s ease",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
              {roomTypeConfig.icon}
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  ml: 1,
                  fontSize: "1.5rem",
                }}
              >
                {room.name}
              </Typography>
            </Box>
            <Chip
              label={isAvailable ? "Disponible" : "Réservée"}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
                backdropFilter: "blur(10px)",
              }}
            />
          </Box>

          {/* Indicateur de statut */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: isAvailable ? "#10b981" : "#ef4444",
              border: "2px solid white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Informations principales */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PeopleIcon sx={{ fontSize: 20, color: "#64748b", mr: 1 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  {room.capacity} places
                </Typography>
              </Box>
              <Chip
                label={capacityCategory.label}
                size="small"
                sx={{
                  backgroundColor: `${capacityCategory.color}15`,
                  color: capacityCategory.color,
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              />
            </Box>

            <Chip
              icon={roomTypeConfig.icon}
              label={roomTypeConfig.label}
              sx={{
                backgroundColor: roomTypeConfig.bgColor,
                color: roomTypeConfig.color,
                fontWeight: 500,
                fontSize: "0.8rem",
                "& .MuiChip-icon": {
                  color: roomTypeConfig.color,
                },
              }}
            />
          </Box>

          {/* Équipements */}
          {room.equipments && room.equipments.length > 0 && (
            <>
              <Divider sx={{ mb: 2, backgroundColor: "#e2e8f0" }} />
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#64748b",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 1,
                    display: "block",
                  }}
                >
                  Équipements
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {room.equipments.slice(0, 4).map((equipment, index) => (
                    <Tooltip key={index} title={equipment} arrow>
                      <Chip
                        icon={getEquipmentIcon(equipment)}
                        label={equipment.length > 12 ? `${equipment.substring(0, 12)}...` : equipment}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "0.7rem",
                          height: 24,
                          borderColor: "#e2e8f0",
                          color: "#64748b",
                          "&:hover": {
                            borderColor: "#3730a3",
                            backgroundColor: "#3730a308",
                          },
                          "& .MuiChip-icon": {
                            color: "#64748b",
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                  {room.equipments.length > 4 && (
                    <Chip
                      label={`+${room.equipments.length - 4}`}
                      size="small"
                      sx={{
                        fontSize: "0.7rem",
                        height: 24,
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </>
          )}

          {/* Footer avec disponibilité */}
          <Box 
            sx={{ 
              mt: 3,
              pt: 2,
              borderTop: "1px solid #f1f5f9",
              textAlign: "center",
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: isAvailable ? "#059669" : "#dc2626",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {isAvailable ? "Cliquez pour réserver" : "Actuellement occupée"}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RoomCard;
