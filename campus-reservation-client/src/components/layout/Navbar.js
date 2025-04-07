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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Event,
  AccountCircle,
  ExitToApp,
  AdminPanelSettings,
  School,
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
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Menu Burger Mobile */}
          <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleToggleDrawer}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleToggleDrawer}
            >
              <Box sx={{ width: 250 }} role="presentation">
                <List>
                  <ListItem button onClick={() => handleNavigate("/")}>
                    <ListItemIcon>
                      <School />
                    </ListItemIcon>
                    <ListItemText primary="Accueil" />
                  </ListItem>
                  {isAuthenticated && (
                    <>
                      <ListItem
                        button
                        onClick={() => handleNavigate("/dashboard")}
                      >
                        <ListItemIcon>
                          <Dashboard />
                        </ListItemIcon>
                        <ListItemText primary="Tableau de bord" />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => handleNavigate("/my-reservations")}
                      >
                        <ListItemIcon>
                          <Event />
                        </ListItemIcon>
                        <ListItemText primary="Mes réservations" />
                      </ListItem>
                      {user?.role === "admin" && (
                        <ListItem
                          button
                          onClick={() => handleNavigate("/admin")}
                        >
                          <ListItemIcon>
                            <AdminPanelSettings />
                          </ListItemIcon>
                          <ListItemText primary="Administration" />
                        </ListItem>
                      )}
                      <Divider />
                      <ListItem
                        button
                        onClick={() => handleNavigate("/profile")}
                      >
                        <ListItemIcon>
                          <AccountCircle />
                        </ListItemIcon>
                        <ListItemText primary="Profil" />
                      </ListItem>
                      <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                          <ExitToApp />
                        </ListItemIcon>
                        <ListItemText primary="Déconnexion" />
                      </ListItem>
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      <ListItem button onClick={() => handleNavigate("/login")}>
                        <ListItemIcon>
                          <AccountCircle />
                        </ListItemIcon>
                        <ListItemText primary="Connexion" />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => handleNavigate("/register")}
                      >
                        <ListItemIcon>
                          <AccountCircle />
                        </ListItemIcon>
                        <ListItemText primary="Inscription" />
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </Box>

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            CAMPUS
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isAuthenticated && (
              <>
                <Button
                  onClick={() => handleNavigate("/dashboard")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Tableau de bord
                </Button>
                <Button
                  onClick={() => handleNavigate("/my-reservations")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Mes réservations
                </Button>
                {user?.role === "admin" && (
                  <Button
                    onClick={() => handleNavigate("/admin")}
                    sx={{ my: 2, color: "white", display: "block" }}
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
                <Tooltip title="Ouvrir les paramètres">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.firstName}
                      src={
                        user?.profilePicture ||
                        "/static/images/avatar/default.jpg"
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
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
                  <MenuItem onClick={() => handleNavigate("/profile")}>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profil</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Déconnexion</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Button
                  onClick={() => handleNavigate("/login")}
                  sx={{ color: "white" }}
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => handleNavigate("/register")}
                  sx={{ color: "white" }}
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
