import api from "./api";

// Get current user profile
export async function getCurrentUser() {
  const res = await api.get("/users/profile");
  return res.data;
}

// Update current user profile
export async function updateCurrentUser(userData) {
  const res = await api.patch("/users/profile", userData);
  return res.data;
}
