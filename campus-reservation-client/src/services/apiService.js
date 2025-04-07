import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Configure axios avec l'URL de base
const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service pour les opérations liées aux étages et salles
export const floorService = {
  // Récupérer tous les étages
  getAllFloors: async () => {
    try {
      const response = await api.get("/floors");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un étage par son numéro
  getFloorByNumber: async (floorNumber) => {
    try {
      const response = await api.get(`/floors/${floorNumber}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les salles d'un étage avec leur statut
  getRoomsByFloor: async (floorNumber) => {
    try {
      const response = await api.get(`/floors/${floorNumber}/rooms`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un étage (admin)
  updateFloor: async (floorNumber, floorData) => {
    try {
      const response = await api.put(`/floors/${floorNumber}`, floorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Ajouter un élément à un étage (admin)
  addElementToFloor: async (floorNumber, elementData) => {
    try {
      const response = await api.post(
        `/floors/${floorNumber}/elements`,
        elementData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un élément (admin)
  updateElement: async (floorNumber, elementId, elementData) => {
    try {
      const response = await api.put(
        `/floors/${floorNumber}/elements/${elementId}`,
        elementData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un élément (admin)
  deleteElement: async (floorNumber, elementId) => {
    try {
      const response = await api.delete(
        `/floors/${floorNumber}/elements/${elementId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Service pour les opérations liées aux réservations
export const reservationService = {
  // Créer une nouvelle réservation
  createReservation: async (reservationData) => {
    try {
      const response = await api.post("/reservations", reservationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer toutes les réservations (admin/professeur)
  getAllReservations: async (filters = {}) => {
    try {
      const response = await api.get("/reservations", { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer mes réservations
  getMyReservations: async () => {
    try {
      const response = await api.get("/reservations/my");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une réservation par son ID
  getReservationById: async (id) => {
    try {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une réservation
  updateReservation: async (id, reservationData) => {
    try {
      const response = await api.put(`/reservations/${id}`, reservationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une réservation
  deleteReservation: async (id) => {
    try {
      const response = await api.delete(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
