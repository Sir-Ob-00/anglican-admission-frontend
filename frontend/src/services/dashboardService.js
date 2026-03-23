import api from "./api";

export async function getDashboardSummary() {
  try {
    // Try to get admin data - update this endpoint based on your backend
    const res = await api.get("/admin/summary");
    return res.data;
  } catch (error) {
    console.log("Admin summary endpoint not available, returning mock data");
    // Return mock data for admin dashboard
    return {
      totals: {
        totalApplicants: 150,
        totalStudents: 450,
        totalTeachers: 25,
        totalParents: 200,
        totalClasses: 8,
        totalPayments: 89
      },
      workflow: {
        admissionRate: 75
      },
      applicantsByClass: [
        { class: "Nursery", count: 45 },
        { class: "KG1", count: 38 },
        { class: "KG2", count: 42 },
        { class: "Grade 1", count: 25 }
      ],
      admissionsByClass: [
        { class: "Nursery", count: 35 },
        { class: "KG1", count: 30 },
        { class: "KG2", count: 32 },
        { class: "Grade 1", count: 18 }
      ]
    };
  }
}

export async function getHeadteacherDashboard() {
  try {
    const res = await api.get("/api/dashboard/headteacher");
    return res.data;
  } catch (error) {
    console.log("Headteacher dashboard endpoint not available");
    return null;
  }
}

export async function getAssistantDashboard() {
  try {
    const res = await api.get("/api/dashboard/assistant");
    return res.data;
  } catch (error) {
    console.log("Assistant dashboard endpoint not available");
    return null;
  }
}

export async function getTeacherDashboard() {
  try {
    const res = await api.get("/api/dashboard/teacher");
    return res.data;
  } catch (error) {
    console.log("Teacher dashboard endpoint not available");
    return null;
  }
}

export async function getParentDashboard() {
  try {
    const res = await api.get("/api/dashboard/parent");
    return res.data;
  } catch (error) {
    console.log("Parent dashboard endpoint not available");
    return null;
  }
}
