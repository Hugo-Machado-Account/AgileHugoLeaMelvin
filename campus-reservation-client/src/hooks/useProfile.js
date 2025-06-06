import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ACTIVITY_TYPES } from '../utils/profileConstants';
import { analyzeReservationStats } from '../utils/profileUtils';

const useProfile = () => {
  const { user } = useAuth();
  
  // États
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    department: "",
    role: "",
    bio: "Aucune biographie renseignée.",
    notifications: true,
    darkMode: false,
  });

  const [stats, setStats] = useState({
    totalReservations: 0,
    upcomingReservations: 0,
    cancelledReservations: 0,
    mostUsedRoom: "N/A",
    mostFrequentDay: "N/A",
    reservationsThisMonth: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  // Charger les données UNE SEULE FOIS au montage
  useEffect(() => {
    if (!user) return;

    const loadData = () => {
      try {
        setLoading(true);

        // Données mockées pour les réservations
        const mockReservations = [
          {
            _id: "1",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
            roomId: "Room 101",
            floorNumber: 1,
            startTime: "10:00",
            endTime: "12:00",
            status: "confirmed",
          },
          {
            _id: "2",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
            roomId: "Room 203",
            floorNumber: 2,
            startTime: "14:00",
            endTime: "16:00",
            status: "confirmed",
          },
          {
            _id: "3",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            roomId: "Room 102",
            floorNumber: 1,
            startTime: "09:00",
            endTime: "10:00",
            status: "cancelled",
          },
        ];

        const mockActivity = [
          {
            type: ACTIVITY_TYPES.RESERVATION_CREATED,
            date: new Date(Date.now() - 1000 * 60 * 60 * 2),
            room: "Salle 101",
            status: "confirmed",
          },
          {
            type: ACTIVITY_TYPES.PROFILE_UPDATED,
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          },
          {
            type: ACTIVITY_TYPES.RESERVATION_CANCELLED,
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            room: "Salle 203",
          },
        ];

        // Mettre à jour les données du profil
        setProfileData({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          username: user?.username || "",
          department: user?.department || "",
          role: user?.role || "student",
          bio: user?.bio || "Aucune biographie renseignée.",
          notifications: user?.notifications !== false,
          darkMode: user?.darkMode || false,
        });

        // Analyser les statistiques
        const calculatedStats = analyzeReservationStats(mockReservations);
        setStats(calculatedStats);

        // Définir l'activité récente
        setRecentActivity(mockActivity);

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement du profil");
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]); // Dépendance UNIQUEMENT sur user.id

  // Mettre à jour les données du profil
  const updateProfileData = useCallback((updates) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  }, []);

  // Gérer les messages avec auto-clear
  const showSuccess = useCallback((message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  }, []);

  const showError = useCallback((message) => {
    setError(message);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Fonction vide pour la compatibilité
  const changeColor = useCallback(() => {
    showSuccess("Design corporate uniforme activé");
  }, [showSuccess]);

  return {
    // États
    loading,
    error,
    success,
    profileData,
    stats,
    recentActivity,
    
    // Actions
    updateProfileData,
    changeColor,
    showSuccess,
    showError,
    clearMessages,
  };
};

export default useProfile; 