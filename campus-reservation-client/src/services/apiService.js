import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Configure axios with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add authentication token
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

// Floor and room related operations
export const floorService = {
  // Get all floors
  getAllFloors: async () => {
    try {
      const response = await api.get("/floors");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a floor by number
  getFloorByNumber: async (floorNumber) => {
    try {
      const response = await api.get(`/floors/${floorNumber}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get rooms for a floor with their status
  getRoomsByFloor: async (floorNumber) => {
    try {
      const response = await api.get(`/floors/${floorNumber}/rooms`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a floor (admin)
  updateFloor: async (floorNumber, floorData) => {
    try {
      const response = await api.put(`/floors/${floorNumber}`, floorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add an element to a floor (admin)
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

  // Créer un étage (admin)
  createFloor: async (floorData) => {
    try {
      const response = await api.post('/floors', floorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an element (admin)
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

  // Delete an element (admin)
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

// Reservation related operations
export const reservationService = {
  // Create a new reservation
  createReservation: async (reservationData) => {
    try {
      const response = await api.post("/reservations", reservationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all reservations (admin/teacher)
  getAllReservations: async (filters = {}) => {
    try {
      const response = await api.get("/reservations", { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get my reservations
  getMyReservations: async () => {
    try {
      const response = await api.get("/reservations/my");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a reservation by ID
  getReservationById: async (id) => {
    try {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a reservation
  updateReservation: async (id, reservationData) => {
    try {
      const response = await api.put(`/reservations/${id}`, reservationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a reservation
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
