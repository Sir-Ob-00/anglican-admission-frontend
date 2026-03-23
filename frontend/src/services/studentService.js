import api from "./api";

export async function listStudents() {
  const res = await api.get("/students");
  return res.data;
}

