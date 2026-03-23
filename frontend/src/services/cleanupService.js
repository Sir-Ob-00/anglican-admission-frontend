import api from "./api";

/**
 * Clear all frontend data from localStorage
 */
export function clearFrontendData() {
  // Clear authentication data
  localStorage.removeItem("aas_token");
  localStorage.removeItem("aas_user");
  
  // Clear any other stored data
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith("aas_") || key.includes("token") || key.includes("user")) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear session storage
  sessionStorage.clear();
  
  console.log("✅ Frontend data cleared successfully");
}

/**
 * Clear all backend data (requires admin privileges)
 * WARNING: This will permanently delete ALL data
 */
export async function clearAllBackendData() {
  try {
    console.log("🔄 Starting backend data cleanup...");
    
    // Clear all applicants
    console.log("📋 Clearing applicants...");
    const applicantsRes = await api.get("/applicants");
    const applicants = applicantsRes.data.items || [];
    
    for (const applicant of applicants) {
      await api.delete(`/applicants/${applicant._id}`);
    }
    console.log(`✅ Deleted ${applicants.length} applicants`);
    
    // Clear all users (except current admin)
    console.log("👥 Clearing users...");
    const usersRes = await api.get("/users");
    const users = usersRes.data || [];
    
    const currentUser = JSON.parse(localStorage.getItem("aas_user") || "{}");
    
    for (const user of users) {
      if (user._id !== currentUser._id) {
        await api.delete(`/users/${user._id}`);
      }
    }
    console.log(`✅ Deleted ${users.length - 1} users (kept current admin)`);
    
    // Clear all exams
    console.log("📝 Clearing exams...");
    const examsRes = await api.get("/exams");
    const exams = examsRes.data.items || [];
    
    for (const exam of exams) {
      await api.delete(`/exams/${exam._id}`);
    }
    console.log(`✅ Deleted ${exams.length} exams`);
    
    // Clear all payments
    console.log("💳 Clearing payments...");
    const paymentsRes = await api.get("/payments");
    const payments = paymentsRes.data || [];
    
    for (const payment of payments) {
      await api.delete(`/payments/${payment._id}`);
    }
    console.log(`✅ Deleted ${payments.length} payments`);
    
    // Clear all documents
    console.log("📄 Clearing documents...");
    const documentsRes = await api.get("/documents");
    const documents = documentsRes.data || [];
    
    for (const document of documents) {
      await api.delete(`/documents/${document._id}`);
    }
    console.log(`✅ Deleted ${documents.length} documents`);
    
    // Clear all notifications
    console.log("🔔 Clearing notifications...");
    const notificationsRes = await api.get("/notifications");
    const notifications = notificationsRes.data || [];
    
    for (const notification of notifications) {
      await api.delete(`/notifications/${notification._id}`);
    }
    console.log(`✅ Deleted ${notifications.length} notifications`);
    
    // Clear all activity logs
    console.log("📊 Clearing activity logs...");
    const logsRes = await api.get("/activity-logs");
    const logs = logsRes.data || [];
    
    for (const log of logs) {
      await api.delete(`/activity-logs/${log._id}`);
    }
    console.log(`✅ Deleted ${logs.length} activity logs`);
    
    // Clear all classes
    console.log("🏫 Clearing classes...");
    const classesRes = await api.get("/classes");
    const classes = classesRes.data || [];
    
    for (const cls of classes) {
      await api.delete(`/classes/${cls._id}`);
    }
    console.log(`✅ Deleted ${classes.length} classes`);
    
    // Clear all teachers
    console.log("👨‍🏫 Clearing teachers...");
    const teachersRes = await api.get("/teachers");
    const teachers = teachersRes.data || [];
    
    for (const teacher of teachers) {
      await api.delete(`/teachers/${teacher._id}`);
    }
    console.log(`✅ Deleted ${teachers.length} teachers`);
    
    // Clear all parents
    console.log("👨‍👩‍👧‍👦 Clearing parents...");
    const parentsRes = await api.get("/parents");
    const parents = parentsRes.data || [];
    
    for (const parent of parents) {
      await api.delete(`/parents/${parent._id}`);
    }
    console.log(`✅ Deleted ${parents.length} parents`);
    
    console.log("🎉 All backend data cleared successfully!");
    
    return {
      success: true,
      message: "All data cleared successfully",
      deletedCounts: {
        applicants: applicants.length,
        users: users.length - 1,
        exams: exams.length,
        payments: payments.length,
        documents: documents.length,
        notifications: notifications.length,
        activityLogs: logs.length,
        classes: classes.length,
        teachers: teachers.length,
        parents: parents.length
      }
    };
    
  } catch (error) {
    console.error("❌ Error clearing backend data:", error);
    throw error;
  }
}

/**
 * Reset entire system (frontend + backend)
 */
export async function resetEntireSystem() {
  try {
    // Clear frontend data first
    clearFrontendData();
    
    // Clear backend data
    const result = await clearAllBackendData();
    
    // Force page reload to ensure clean state
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
    
    return result;
    
  } catch (error) {
    console.error("❌ Error resetting system:", error);
    throw error;
  }
}

/**
 * Get system statistics before clearing
 */
export async function getSystemStats() {
  try {
    const stats = {};
    
    // Get counts for each data type
    const applicantsRes = await api.get("/applicants");
    stats.applicants = applicantsRes.data.items?.length || 0;
    
    const usersRes = await api.get("/users");
    stats.users = usersRes.data?.length || 0;
    
    const examsRes = await api.get("/exams");
    stats.exams = examsRes.data.items?.length || 0;
    
    const paymentsRes = await api.get("/payments");
    stats.payments = paymentsRes.data?.length || 0;
    
    const documentsRes = await api.get("/documents");
    stats.documents = documentsRes.data?.length || 0;
    
    const notificationsRes = await api.get("/notifications");
    stats.notifications = notificationsRes.data?.length || 0;
    
    const logsRes = await api.get("/activity-logs");
    stats.activityLogs = logsRes.data?.length || 0;
    
    const classesRes = await api.get("/classes");
    stats.classes = classesRes.data?.length || 0;
    
    const teachersRes = await api.get("/teachers");
    stats.teachers = teachersRes.data?.length || 0;
    
    const parentsRes = await api.get("/parents");
    stats.parents = parentsRes.data?.length || 0;
    
    return stats;
    
  } catch (error) {
    console.error("❌ Error getting system stats:", error);
    return {};
  }
}
