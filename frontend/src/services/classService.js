import api from "./api";

export async function createClassV1(payload) {
  const res = await api.post("/classes", payload);
  return res.data;
}

export async function assignTeacherToClass(payload) {
  const res = await api.post("/classes/assign-teacher", payload);
  return res.data;
}

export async function listHeadteacherClasses() {
  const res = await api.get("/headteacher/classes");
  return res.data;
}

export async function getHeadteacherClassById(id) {
  const res = await api.get(`/headteacher/classes/${id}`);
  return res.data;
}

export async function createHeadteacherClass(payload) {
  const res = await api.post("/headteacher/classes", payload);
  return res.data;
}

export async function updateHeadteacherClass(id, payload) {
  const res = await api.patch(`/headteacher/classes/${id}`, payload);
  return res.data;
}

export async function deleteHeadteacherClass(id) {
  const res = await api.delete(`/headteacher/classes/${id}`);
  return res.data;
}
