import { ROLES, ACTIVITY_TYPES } from './profileConstants';

// Formater la date d'inscription
export const formatDate = (dateString) => {
  if (!dateString) return "Non disponible";
  
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

// Déterminer le rôle affiché
export const getRoleDisplay = (role) => {
  return ROLES[role] || ROLES.student;
};

// Récupérer les initiales de l'utilisateur
export const getInitials = (firstName, lastName, username) => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`;
  }
  return username?.[0] || "?";
};

// Formater la date pour l'activité récente
export const formatActivityDate = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`;
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
  } else {
    return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  }
};

// Obtenir le texte pour l'activité récente
export const getActivityText = (activity) => {
  switch (activity.type) {
    case ACTIVITY_TYPES.RESERVATION_CREATED:
      return `Réservation créée pour ${activity.room}`;
    case ACTIVITY_TYPES.RESERVATION_CANCELLED:
      return `Réservation annulée pour ${activity.room}`;
    case ACTIVITY_TYPES.PROFILE_UPDATED:
      return `Profil mis à jour`;
    default:
      return "Activité inconnue";
  }
};

// Calculer le pourcentage d'achèvement du profil
export const calculateProfileCompletion = (profileData) => {
  let total = 0;
  let filled = 0;

  const fields = [
    "firstName",
    "lastName", 
    "email",
    "username",
    "department",
    "role",
    "bio",
  ];

  fields.forEach((field) => {
    total++;
    if (
      profileData[field] &&
      profileData[field] !== "N/A" &&
      profileData[field] !== "Aucune biographie renseignée."
    ) {
      filled++;
    }
  });

  return Math.round((filled / total) * 100);
};

// Analyser les statistiques des réservations
export const analyzeReservationStats = (reservations) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = reservations.filter(
    (res) => new Date(res.date) >= today
  );

  const cancelled = reservations.filter(
    (res) => res.status === "cancelled"
  );

  const roomCounts = {};
  const daysCounts = {};
  const thisMonth = today.getMonth();
  const thisMonthReservations = reservations.filter((res) => {
    const resDate = new Date(res.date);
    return resDate.getMonth() === thisMonth;
  });

  // Compter les réservations par salle et par jour
  reservations.forEach((res) => {
    // Compter par salle
    const roomId = res.roomId || "Non spécifié";
    roomCounts[roomId] = (roomCounts[roomId] || 0) + 1;

    // Compter par jour de la semaine
    try {
      const dayOfWeek = new Date(res.date).toLocaleString("fr-FR", {
        weekday: "long",
      });
      daysCounts[dayOfWeek] = (daysCounts[dayOfWeek] || 0) + 1;
    } catch (error) {
      console.warn("Erreur lors du calcul des jours:", error);
    }
  });

  // Trouver la salle la plus utilisée
  let mostUsedRoom = "N/A";
  let maxCount = 0;
  Object.entries(roomCounts).forEach(([room, count]) => {
    if (count > maxCount) {
      mostUsedRoom = room;
      maxCount = count;
    }
  });

  // Trouver le jour le plus fréquent
  let mostFrequentDay = "N/A";
  maxCount = 0;
  Object.entries(daysCounts).forEach(([day, count]) => {
    if (count > maxCount) {
      mostFrequentDay = day;
      maxCount = count;
    }
  });

  return {
    totalReservations: reservations.length,
    upcomingReservations: upcoming.length,
    cancelledReservations: cancelled.length,
    mostUsedRoom,
    mostFrequentDay,
    reservationsThisMonth: thisMonthReservations.length,
  };
}; 