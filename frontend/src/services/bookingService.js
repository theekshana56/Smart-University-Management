import { apiClient } from "../api/apiClient";

export const bookingService = {
  async createBooking(data) {
    try {
      const response = await apiClient.post("/bookings", data);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  async getMyBookings() {
    try {
      const response = await apiClient.get("/bookings/my");
      return response.data;
    } catch (error) {
      console.error("Error fetching my bookings:", error);
      throw error;
    }
  },

  async getAllBookings() {
    try {
      const response = await apiClient.get("/bookings");
      return response.data;
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      throw error;
    }
  },

  async approveBooking(id) {
    try {
      const response = await apiClient.put(`/bookings/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error(`Error approving booking ${id}:`, error);
      throw error;
    }
  },

  async rejectBooking(id, reason) {
    try {
      const response = await apiClient.put(`/bookings/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting booking ${id}:`, error);
      throw error;
    }
  },

  async cancelBooking(id) {
    try {
      const response = await apiClient.put(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling booking ${id}:`, error);
      throw error;
    }
  }
};
//done