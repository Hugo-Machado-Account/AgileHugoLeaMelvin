import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reservationService } from '../services/apiService';
import { PROFILE_COLORS, ACTIVITY_TYPES, COLOR_NAMES } from '../utils/profileConstants';
import { analyzeReservationStats } from '../utils/profileUtils';

const useProfile = () => {
  const { user, getUserProfile } = useAuth();
  
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
    preferredColor: PROFILE_COLORS[0],
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

  // Données simulées pour les réservations
  const getMockReservations = useCallback(() => [
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
  ], []);

  // Activité récente simulée
  const getMockRecentActivity = useCallback(() => [
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
  ], []);

  // Charger les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Récupérer le profil complet
        let updatedUser = user;
        try {
          if (getUserProfile) {
            updatedUser = await getUserProfile();
          }
        } catch (profileError) {
          console.warn("Impossible de récupérer le profil complet:", profileError);
        }

        // Mettre à jour les données du profil
        setProfileData({
          firstName: updatedUser?.firstName || "",
          lastName: updatedUser?.lastName || "",
          email: updatedUser?.email || "",
          username: updatedUser?.username || "",
          department: updatedUser?.department || "",
          role: updatedUser?.role || "student",
          bio: updatedUser?.bio || "Aucune biographie renseignée.",
          preferredColor: updatedUser?.preferredColor || PROFILE_COLORS[0],
          notifications: updatedUser?.notifications !== false,
          darkMode: updatedUser?.darkMode || false,
        });

        // Récupérer les réservations
        let reservations = [];
        try {
          if (reservationService?.getMyReservations) {
            reservations = await reservationService.getMyReservations();
          } else {
            // Données simulées
            reservations = getMockReservations();
          }
        } catch (reservationsError) {
          console.warn("Impossible de récupérer les réservations:", reservationsError);
          reservations = getMockReservations();
        }

        // Analyser les statistiques
        const calculatedStats = analyzeReservationStats(reservations);
        setStats(calculatedStats);

        // Créer l'activité récente
        setRecentActivity(getMockRecentActivity());

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(err.message || "Une erreur est survenue lors du chargement du profil");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, getUserProfile, getMockReservations, getMockRecentActivity]);

  // Mettre à jour les données du profil avec validation
  const updateProfileData = useCallback((updates) => {
    console.log('📝 updateProfileData appelé avec:', updates);
    
    setProfileData(prev => {
      // Si on change la couleur, vérifier qu'elle est valide
      if (updates.preferredColor && !PROFILE_COLORS.includes(updates.preferredColor)) {
        console.warn('❌ Couleur non valide:', updates.preferredColor);
        return prev;
      }
      
      const newData = { ...prev, ...updates };
      
      // Log pour debug
      if (updates.preferredColor) {
        console.log('🎨 Couleur du profil mise à jour de', prev.preferredColor, 'vers', updates.preferredColor);
      }
      
      // Force le re-render en créant un nouvel objet
      return newData;
    });
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

  // Changer la couleur avec feedback immédiat et nom explicite
  const changeColor = useCallback((color) => {
    console.log('🎨 changeColor appelé avec la couleur:', color);
    
    if (!color || !PROFILE_COLORS.includes(color)) {
      console.error('❌ Couleur invalide:', color);
      showError('Couleur non valide');
      return;
    }

    // Mise à jour immédiate
    updateProfileData({ preferredColor: color });
    
    const colorName = COLOR_NAMES[color] || color;
    showSuccess(`Couleur changée : ${colorName} ! ✨`);
    
    // Log pour vérification
    console.log('✅ Couleur changée avec succès:', color, '(' + colorName + ')');
    
    // Simuler une sauvegarde
    setTimeout(() => {
      console.log('💾 Couleur sauvegardée:', color, '(' + colorName + ')');
    }, 500);
  }, [updateProfileData, showSuccess, showError]);

  // Debug: Log du profileData actuel
  useEffect(() => {
    console.log('🔄 ProfileData mis à jour:', profileData.preferredColor);
  }, [profileData.preferredColor]);

  return {
    // États
    loading,
    error,
    success,
    profileData,
    stats,
    recentActivity,
    user,
    
    // Actions
    updateProfileData,
    changeColor,
    showSuccess,
    showError,
    clearMessages,
  };
};

export default useProfile; 