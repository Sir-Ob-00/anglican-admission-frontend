import api from "./api";

export async function getReports() {
  const res = await api.get("/reports");
  return res.data;
}

