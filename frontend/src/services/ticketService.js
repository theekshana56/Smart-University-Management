import { apiClient } from "../api/apiClient";

export const ticketService = {
  async list() {
    const response = await apiClient.get("/tickets");
    return response.data;
  },

  async create(payload) {
    const formData = new FormData();
    formData.append("resourceLocation", payload.resourceLocation || "");
    formData.append("category", payload.category || "");
    formData.append("description", payload.description || "");
    formData.append("priority", payload.priority || "MEDIUM");
    formData.append("preferredContact", payload.preferredContact || "");
    (payload.images || []).slice(0, 3).forEach((file) => {
      if (file) formData.append("images", file);
    });
    const response = await apiClient.post("/tickets", formData);
    return response.data;
  },

  async assign(ticketId, technicianId) {
    const response = await apiClient.put(`/tickets/${ticketId}/assign`, { technicianId });
    return response.data;
  },

  async updateStatus(ticketId, payload) {
    const response = await apiClient.put(`/tickets/${ticketId}/status`, payload);
    return response.data;
  },

  async listComments(ticketId) {
    const response = await apiClient.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  async addComment(ticketId, content) {
    const response = await apiClient.post(`/tickets/${ticketId}/comments`, { content });
    return response.data;
  },

  async updateComment(commentId, content) {
    const response = await apiClient.put(`/tickets/comments/${commentId}`, { content });
    return response.data;
  },

  async deleteComment(commentId) {
    const response = await apiClient.delete(`/tickets/comments/${commentId}`);
    return response.data;
  },
};
