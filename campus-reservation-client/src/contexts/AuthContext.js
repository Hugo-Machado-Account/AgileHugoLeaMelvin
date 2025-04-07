import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'utilisateur à partir du localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        }
      );

      const { token, ...userData } = response.data;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      // Set token in axios default headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setLoading(false);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
      setLoading(false);
      throw err;
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );

      const { token, ...user } = response.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Set token in axios default headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setLoading(false);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
      setLoading(false);
      throw err;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Fonction pour récupérer le profil utilisateur
  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/profile"
      );
      setUser((prevUser) => ({ ...prevUser, ...response.data }));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, ...response.data })
      );
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    getUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
