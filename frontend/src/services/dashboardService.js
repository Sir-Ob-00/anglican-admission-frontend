import api from "./api";
import { getApplicantsForParent } from "./parentService";
import { listUsers } from "./adminService";
import { listStudents } from "./studentService";
import { listTeachers } from "./teacherService";
import { listParents } from "./parentService";
import { listPayments } from "./paymentService";

function normalizeParentApplicantsResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.applicants)) return data.applicants;
  if (Array.isArray(data?.data)) return data.data;
  if (data?.applicant) return [data.applicant];
  return [];
}

function normalizeParentApplicant(applicant) {
  const normalizedStatus = String(applicant?.status || "").toLowerCase();
  const normalizedPaymentStatus = String(
    applicant?.paymentStatus || applicant?.payments?.[0]?.status || applicant?.payment?.status || ""
  ).toLowerCase();

  return {
    ...applicant,
    id: applicant.id || applicant._id,
    _id: applicant._id || applicant.id,
    fullName: applicant.fullName || applicant.full_name,
    classApplyingFor: applicant.classApplyingFor || applicant.class?.name || applicant.class_applied || "",
    assignedClass: applicant.assignedClass || applicant.classAssigned?.name || applicant.admittedClass || "",
    createdAt: applicant.createdAt || applicant.created_at,
    status: normalizedStatus,
    paymentStatus: normalizedPaymentStatus || (normalizedStatus === "awaiting_payment" ? "awaiting_payment" : ""),
  };
}

function extractItems(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.applicants)) return data.applicants;
  if (Array.isArray(data?.students)) return data.students;
  if (Array.isArray(data?.teachers)) return data.teachers;
  if (Array.isArray(data?.parents)) return data.parents;
  if (Array.isArray(data?.classes)) return data.classes;
  if (Array.isArray(data?.payments)) return data.payments;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function normalizeClassName(item) {
  return (
    item?.classApplyingFor ||
    item?.class?.name ||
    item?.classAssigned?.name ||
    item?.assignedClass?.name ||
    item?.assignedClass ||
    item?.className ||
    item?.class ||
    "Unspecified"
  );
}

function buildCountByClass(items, predicate = () => true) {
  const counts = new Map();

  for (const item of items) {
    if (!predicate(item)) continue;
    const key = normalizeClassName(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([className, count]) => ({ class: className, count }))
    .sort((a, b) => String(a.class).localeCompare(String(b.class)));
}

export async function getDashboardSummary() {
  try {
    const res = await api.get("/admin/summary");
    return res.data;
  } catch (error) {
    console.log("Admin summary endpoint not available, assembling dashboard summary from live endpoints");

    const results = await Promise.allSettled([
      listUsers(),
      api.get("/applicants").then((res) => res.data),
      listStudents(),
      listTeachers(),
      listParents(),
      api.get("/classes").then((res) => res.data),
      listPayments(),
    ]);

    const users = results[0].status === "fulfilled" ? extractItems(results[0].value) : [];
    const applicants = results[1].status === "fulfilled" ? extractItems(results[1].value) : [];
    const students = results[2].status === "fulfilled" ? extractItems(results[2].value) : [];
    const teachers = results[3].status === "fulfilled" ? extractItems(results[3].value) : [];
    const parents = results[4].status === "fulfilled" ? extractItems(results[4].value) : [];
    const classes = results[5].status === "fulfilled" ? extractItems(results[5].value) : [];
    const payments = results[6].status === "fulfilled" ? extractItems(results[6].value) : [];

    const admittedApplicants = applicants.filter((applicant) => {
      const status = String(applicant?.status || applicant?.admissionStatus || "").toLowerCase();
      return status === "admitted" || status === "admission_completed";
    });

    const admissionRate = applicants.length
      ? Math.round((admittedApplicants.length / applicants.length) * 100)
      : 0;

    return {
      totals: {
        totalUsers: users.length,
        totalApplicants: applicants.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalParents: parents.length,
        totalClasses: classes.length,
        totalPayments: payments.length,
      },
      workflow: {
        admissionRate,
      },
      applicantsByClass: buildCountByClass(applicants),
      admissionsByClass: buildCountByClass(admittedApplicants),
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

export async function getParentDashboard(parentId) {
  try {
    const data = await getApplicantsForParent(parentId);
    const applicants = normalizeParentApplicantsResponse(data);
    const normalizedApplicants = applicants.map(normalizeParentApplicant);
    const sortedApplicants = normalizedApplicants
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    const latestApplicant = sortedApplicants[0] || normalizedApplicants[0] || null;

    return {
      applicants: normalizedApplicants,
      latestApplicant,
    };
  } catch (error) {
    console.log("Parent dashboard endpoint not available");
    return null;
  }
}
