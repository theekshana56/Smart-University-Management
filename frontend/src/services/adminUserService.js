import { apiClient } from "../api/apiClient";

export const adminUserService = {
  list: () => apiClient.get("/auth/admin/users").then((r) => r.data),
  create: (payload) => apiClient.post("/auth/admin/users", payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/auth/admin/users/${id}`, payload).then((r) => r.data),
  remove: (id) => apiClient.delete(`/auth/admin/users/${id}`).then((r) => r.data),
};
