import api from "./api";

export async function listTeachers() {
  const res = await api.get("/teachers");
  return res.data;
}

// Headteacher specific endpoints
export async function listAllTeachers() {
  const res = await api.get("/headteacher/teacher/all");
  return res.data;
}

export async function getTeacherById(id) {
  const res = await api.get(`/headteacher/teacher/${id}`);
  return res.data;
}

export async function createTeacher(payload) {
  const res = await api.post("/teachers", payload);
  return res.data;
}

export async function updateTeacher(id, payload) {
  const res = await api.put(`/teachers/${id}`, payload);
  return res.data;
}

export async function activateTeacher(id) {
  const res = await api.put(`/teachers/${id}/activate`);
  return res.data;
}

export async function deactivateTeacher(id) {
  const res = await api.put(`/teachers/${id}/deactivate`);
  return res.data;
}

export async function resetTeacherPassword(id, newPassword) {
  const res = await api.post(`/teachers/${id}/reset-password`, { newPassword });
  return res.data;
}
export async function assignTeacher(payload) {
  const res = await api.post("/headteacher/teacher/assign-teacher", payload);
  return res.data;
}

export async function updateTeacherAssignment(payload) {
  const res = await api.put("/headteacher/teacher/update-assignment", payload);
  return res.data;
}
