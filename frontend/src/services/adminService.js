import api from "./api";

// Create a new user (Admin only)
export async function createUser(userData) {
  const res = await api.post("/admin/users", userData);
  return res.data;
}

// Get all users (Admin only)
export async function listUsers(params) {
  console.log("adminService.listUsers called with params:", params);
  console.log("Making API call to: /admin/users");
  
  const res = await api.get("/admin/users", { params });
  
  console.log("API response status:", res.status);
  console.log("API response data:", res.data);
  console.log("Full response:", res);
  
  return res.data;
}

// Get user by ID (Admin only)
export async function getUserById(userId) {
  const res = await api.get(`/admin/users/${userId}`);
  return res.data;
}

// Update user (Admin only)
export async function updateUser(userId, userData) {
  const res = await api.patch(`/admin/users/${userId}`, userData);
  return res.data;
}

// Delete user (Admin only)
export async function deleteUser(userId) {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
}

// Deactivate user (Admin only)
export async function deactivateUser(userId) {
  const res = await api.patch(`/admin/users/${userId}/deactivate`);
  return res.data;
}

// Activate user (Admin only)
export async function activateUser(userId) {
  const res = await api.patch(`/admin/users/${userId}/activate`);
  return res.data;
}
