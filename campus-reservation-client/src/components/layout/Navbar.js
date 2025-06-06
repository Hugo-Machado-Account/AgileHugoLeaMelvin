import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Event,
  AccountCircle,
  ExitToApp,
  AdminPanelSettings,
  Business as BusinessIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleCloseUserMenu();
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseUserMenu();
    setDrawerOpen(false);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: "#1e3a8a",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          {/* Menu Burger Mobile */}
          <Box sx={{ flexGrow: 2, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleToggleDrawer}
              sx={{ 
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleToggleDrawer}
              PaperProps={{
                sx: {
                  width: 280,
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              <Box sx={{ width: 280 }} role="presentation">
                <Box sx={{ 
                  p: 5, 
                  backgroundColor: "#1e3a8a", 
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Menu
                  </Typography>
                  <IconButton 
                    onClick={handleToggleDrawer}
                    sx={{ color: "white" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <List sx={{ p: 0 }}>
                  <ListItem 
                    button 
                    onClick={() => handleNavigate("/")}
                    sx={{
                      py: 2,
                      "&:hover": {
                        backgroundColor: "#e2e8f0",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <BusinessIcon sx={{ color: "#3730a3" }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Accueil" 
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: "#1e293b",
                      }}
                    />
                  </ListItem>
                  {isAuthenticated && (
                    <>
                      <ListItem
                        button
                        onClick={() => handleNavigate("/dashboard")}
                        sx={{
                          py: 2,
                          "&:hover": {
                            backgroundColor: "#e2e8f0",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Dashboard sx={{ color: "#3730a3" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Tableau de bord"
                          primaryTypographyProps={{
                            fontWeight: 500,
                            color: "#1e293b",
                          }}
                        />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => handleNavigate("/my-reservations")}
                        sx={{
                          py: 2,
                          "&:hover": {
                            backgroundColor: "#e2e8f0",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Event sx={{ color: "#3730a3" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Mes réservations"
                          primaryTypographyProps={{
                            fontWeight: 500,
                            color: "#1e293b",
                          }}
                        />
                      </ListItem>
                      {user?.role === "admin" && (
                        <ListItem
                          button
                          onClick={() => handleNavigate("/admin")}
                          sx={{
                            py: 2,
                            "&:hover": {
                              backgroundColor: "#e2e8f0",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <AdminPanelSettings sx={{ color: "#dc2626" }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Administration"
                            primaryTypographyProps={{
                              fontWeight: 500,
                              color: "#1e293b",
                            }}
                          />
                          <Chip 
                            label="Admin" 
                            size="small" 
                            sx={{ 
                              backgroundColor: "#dc2626",
                              color: "white",
                              fontSize: "0.75rem",
                            }}
                          />
                        </ListItem>
                      )}
                      <Divider sx={{ my: 1, backgroundColor: "#e2e8f0" }} />
                      <ListItem
                        button
                        onClick={() => handleNavigate("/profile")}
                        sx={{
                          py: 2,
                          "&:hover": {
                            backgroundColor: "#e2e8f0",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <AccountCircle sx={{ color: "#3730a3" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Profil"
                          primaryTypographyProps={{
                            fontWeight: 500,
                            color: "#1e293b",
                          }}
                        />
                      </ListItem>
                      <ListItem 
                        button 
                        onClick={handleLogout}
                        sx={{
                          py: 2,
                          "&:hover": {
                            backgroundColor: "#fef2f2",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <ExitToApp sx={{ color: "#dc2626" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Déconnexion"
                          primaryTypographyProps={{
                            fontWeight: 500,
                            color: "#dc2626",
                          }}
                        />
                      </ListItem>
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      <ListItem 
                        button 
                        onClick={() => handleNavigate("/login")}
                        sx={{
                          py: 2,
                          "&:hover": {
                            backgroundColor: "#e2e8f0",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <AccountCircle sx={{ color: "#3730a3" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Connexion"
                          primaryTypographyProps={{
                            fontWeight: 500,
                            color: "#1e293b",
                          }}
                        />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => handleNavigate("/register")}
                        sx={{
                          py: 2,
                          "&:hover": {
                            backgroundColor: "#e2e8f0",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <AccountCircle sx={{ color: "#3730a3" }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Inscription"
                          primaryTypographyProps={{
                            fontWeight: 500,
                            color: "#1e293b",
                          }}
                        />
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </Box>

          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            <BusinessIcon sx={{ fontSize: 32, mr: 1, color: "#60a5fa" }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "white",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
              }}
            >
              CAMPUS
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
            {isAuthenticated && (
              <>
                <Button
                  onClick={() => handleNavigate("/dashboard")}
                  sx={{ 
                    mx: 1,
                    py: 1,
                    px: 2,
                    color: "rgba(255,255,255,0.9)", 
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "white",
                    },
                  }}
                >
                  Tableau de bord
                </Button>
                <Button
                  onClick={() => handleNavigate("/my-reservations")}
                  sx={{ 
                    mx: 1,
                    py: 1,
                    px: 2,
                    color: "rgba(255,255,255,0.9)", 
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "white",
                    },
                  }}
                >
                  Mes réservations
                </Button>
                {user?.role === "admin" && (
                  <Button
                    onClick={() => handleNavigate("/admin")}
                    sx={{ 
                      mx: 1,
                      py: 1,
                      px: 2,
                      color: "#fca5a5", 
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      borderRadius: 2,
                      border: "1px solid rgba(252, 165, 165, 0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(252, 165, 165, 0.1)",
                        color: "#fca5a5",
                      },
                    }}
                  >
                    Administration
                  </Button>
                )}
              </>
            )}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Menu utilisateur">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0,
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Avatar
                      alt={user?.firstName}
                      src={user?.profilePicture}
                      sx={{
                        width: 40,
                        height: 40,
                        border: "2px solid rgba(255,255,255,0.3)",
                        backgroundColor: "#60a5fa",
                        fontWeight: 600,
                      }}
                    >
                      {user?.firstName?.charAt(0) || "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ 
                    mt: "45px",
                    "& .MuiPaper-root": {
                      borderRadius: 2,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      border: "1px solid #e2e8f0",
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #e2e8f0" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {user?.email}
                    </Typography>
                  </Box>
                  <MenuItem 
                    onClick={() => handleNavigate("/profile")}
                    sx={{
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircle fontSize="small" sx={{ color: "#3730a3" }} />
                    </ListItemIcon>
                    <Typography sx={{ fontWeight: 500, color: "#1e293b" }}>
                      Profil
                    </Typography>
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#fef2f2",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <ExitToApp fontSize="small" sx={{ color: "#dc2626" }} />
                    </ListItemIcon>
                    <Typography sx={{ fontWeight: 500, color: "#dc2626" }}>
                      Déconnexion
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <Button
                  onClick={() => handleNavigate("/login")}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => handleNavigate("/register")}
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "#1e3a8a",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Inscription
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
