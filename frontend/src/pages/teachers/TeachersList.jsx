import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import {
  activateTeacher,
  createTeacher,
  deactivateTeacher,
  listTeachers,
  resetTeacherPassword,
  updateTeacher,
  listAllTeachers,
  assignTeacher,
  updateTeacherAssignment,
} from "../../services/teacherService";

export default function TeachersList() {
  const { role } = useAuth();
  const isHeadteacher = role === "headteacher" || role === "assistant_headteacher";
  const [rows, setRows] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetTeacher, setResetTeacher] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uniqueId, setUniqueId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [subjects, setSubjects] = useState("");
  const [assignedClass, setAssignedClass] = useState("");
  const [assignedClassName, setAssignedClassName] = useState("");
  const [allTeachers, setAllTeachers] = useState([]);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function refresh() {
    try {
      setLoadingTeachers(true);
      const data = isHeadteacher
        ? await listAllTeachers()
        : await listTeachers();
      const items = Array.isArray(data) ? data : data.teachers || data.items || data.data || [];
      setRows(items);
    } catch {
      setRows([]);
    } finally {
      setLoadingTeachers(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        await refresh();
      } catch {
        if (!ignore) setRows([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        await refresh();
      } catch {
        if (!ignore) setRows([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);
  const columns = useMemo(
    () => [
      { key: "name", header: "Teacher", render: (r) => r.user?.name || r.name },
      { key: "subject", header: "Subject", render: (r) => r.subjects?.length > 0 ? r.subjects.join(", ") : (r.subject || r.user?.subject || "—") },
      { key: "assignedClass", header: "Class", render: (r) => r.classes?.map(c => c.name).join(", ") || r.assignedClass || "—" },
      {
        key: "status",
        header: "Status",
        render: (r) => (
          <Badge tone={r.user?.isActive === false ? "neutral" : "success"}>
            {r.user?.isActive === false ? "INACTIVE" : "ACTIVE"}
          </Badge>
        ),
      },
      ...(isHeadteacher
        ? [
            {
              key: "edit",
              header: "Edit",
              render: (r) => (
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-2xl bg-slate-900/5 px-3 text-xs font-semibold text-slate-800 hover:bg-slate-900/10"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setEditing(r);
                    setUniqueId(r.uniqueId || r.user?.uniqueId || "");
                    setStaffId(r.staffId || "");
                    setSubjects(r.subjects ? r.subjects.join(", ") : (r.subject || ""));
                    setAssignedClass(r.classes?.[0]?._id || r.classes?.[0]?.id || r.assignedClass || "");
                    setAssignedClassName(r.classes?.map(c => c.name).join(", ") || "");
                    
                    if (isHeadteacher) {
                      try {
                        const allData = await listAllTeachers();
                        const items = Array.isArray(allData) ? allData : allData.teachers || allData.items || allData.data || [];
                        setAllTeachers(items);
                      } catch (err) {
                        console.error(err);
                      }
                    }
                    
                    setEditOpen(true);
                  }}
                >
                  Edit
                </button>
              ),
            },
          ]
        : []),
      ...(role === "admin"
        ? [
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-2xl bg-slate-900/5 px-3 text-xs font-semibold text-slate-800 hover:bg-slate-900/10"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await activateTeacher(r._id || r.id);
                        await refresh();
                        setSuccessMessage("Teacher activated successfully!");
                        setSuccessModalOpen(true);
                      } catch (err) {
                        setErrorMessage(err.response?.data?.message || "Activate failed.");
                        setErrorModalOpen(true);
                      }
                    }}
                  >
                    Activate
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-2xl bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-700"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await deactivateTeacher(r._id || r.id);
                        await refresh();
                        setSuccessMessage("Teacher deactivated successfully!");
                        setSuccessModalOpen(true);
                      } catch (err) {
                        setErrorMessage(err.response?.data?.message || "Deactivate failed.");
                        setErrorModalOpen(true);
                      }
                    }}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-2xl bg-[color:var(--brand)] px-3 text-xs font-semibold text-white hover:brightness-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResetTeacher(r);
                      setNewPassword("");
                      setResetOpen(true);
                    }}
                  >
                    Reset Password
                  </button>
                </div>
              ),
            },
          ]
        : []),
    ],
    [role]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Teachers"
        subtitle="Teacher directory."
        right={
          isHeadteacher ? (
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[color:var(--brand)] px-5 text-sm font-semibold text-white shadow-sm hover:brightness-110"
              onClick={async () => {
                setEditing(null);
                setUniqueId("");
                setStaffId("");
                setSubjects("");
                setAssignedClass("");
                setAssignedClassName("");
                
                try {
                  const allData = await listAllTeachers();
                  const items = Array.isArray(allData) ? allData : allData.teachers || allData.items || allData.data || [];
                  setAllTeachers(items);
                } catch (err) {
                  console.error(err);
                }

                setEditOpen(true);
              }}
            >
              Add Teacher
            </button>
          ) : null
        }
      />
      <Table
        title="Teachers List"
        rows={rows}
        columns={columns}
        loading={loadingTeachers}
        loadingText="Loading teachers..."
      />

      <Modal
        open={resetOpen}
        title="Reset Teacher Password"
        onClose={() => setResetOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-slate-900/5 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-900/10"
              onClick={() => setResetOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-[color:var(--brand)] px-4 text-sm font-semibold text-white hover:brightness-110"
              onClick={async () => {
                try {
                  await resetTeacherPassword(resetTeacher?._id || resetTeacher?.id, newPassword);
                  setResetOpen(false);
                  await refresh();
                  setSuccessMessage("Password reset successfully!");
                  setSuccessModalOpen(true);
                } catch (err) {
                  setErrorMessage(err.response?.data?.message || "Reset password failed.");
                  setErrorModalOpen(true);
                }
              }}
              disabled={!newPassword}
            >
              Reset
            </button>
          </div>
        }
      >
        <div className="text-sm text-slate-700">
          Set a new temporary password for{" "}
          <span className="font-semibold text-slate-900">{resetTeacher?.user?.name || "teacher"}</span>.
        </div>
        <input
          type="password"
          className="mt-3 h-11 w-full rounded-2xl border border-slate-200/70 bg-white/80 px-3 text-slate-900 outline-none focus:border-[color:var(--brand)]"
          placeholder="New temporary password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Modal>

      <Modal
        open={editOpen}
        title={editing ? "Edit Teacher" : "Add Teacher"}
        onClose={() => setEditOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-slate-900/5 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-900/10"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-[color:var(--brand)] px-4 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
              disabled={!uniqueId}
              onClick={async () => {
                try {
                  const subjectArray = subjects.split(",").map(s => s.trim()).filter(Boolean);
                  if (editing) {
                    if (isHeadteacher) {
                      await updateTeacherAssignment({
                        uniqueId,
                        staffId: staffId || undefined,
                        subject: subjectArray,
                        classId: assignedClass || undefined
                      });
                    } else {
                      await updateTeacher(editing._id || editing.id, { staffId, subject: subjectArray, assignedClass });
                    }
                  } else {
                    if (isHeadteacher) {
                      await assignTeacher({ 
                        uniqueId, 
                        staffId: staffId || undefined, 
                        subject: subjectArray, 
                        classId: assignedClass || undefined 
                      });
                    } else {
                      await createTeacher({ user: uniqueId, staffId, subject: subjectArray.join(", "), assignedClass });
                    }
                  }
                  await refresh();
                  setEditOpen(false);
                  setSuccessMessage(editing ? "Teacher updated successfully!" : "Teacher added successfully!");
                  setSuccessModalOpen(true);
                } catch (err) {
                  setErrorMessage(err.response?.data?.message || err.message || "Save failed.");
                  setErrorModalOpen(true);
                }
              }}
            >
              Save
            </button>
          </div>
        }
      >
        {!editing && isHeadteacher && (
          <div className="mb-3 rounded-2xl bg-white/60 p-3 text-sm text-slate-700">
            Select a <span className="font-semibold">Teacher</span> to associate them to a class and update subjects. Data will populate automatically upon match.
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-800">Teacher Unique ID</label>
            <select
              className="mt-1 h-11 w-full rounded-2xl border border-slate-200/70 bg-white/80 px-3 text-slate-900 outline-none focus:border-[color:var(--brand)]"
              value={uniqueId}
              onChange={(e) => {
                const newUniqueId = e.target.value;
                setUniqueId(newUniqueId);
                
                if (!newUniqueId) {
                  setAssignedClass("");
                  setStaffId("");
                  setSubjects("");
                  return;
                }
                
                const match = allTeachers.find(r => r.uniqueId === newUniqueId || r.user?.uniqueId === newUniqueId);
                if (match) {
                  const currentClasses = match.classes || match.class;
                  const classesArr = Array.isArray(currentClasses) ? currentClasses : (currentClasses ? [currentClasses] : []);
                  
                  if (classesArr.length > 0) {
                    setAssignedClass(classesArr[0]._id || classesArr[0].id);
                    setAssignedClassName(classesArr.map(c => c.name).join(", "));
                  } else {
                    setAssignedClass(match.assignedClass || "");
                    setAssignedClassName("");
                  }
                  
                  setStaffId(match.staffId || "");
                  
                  if (match.subjects?.length > 0) {
                    setSubjects(match.subjects.join(", "));
                  } else {
                    setSubjects(match.subject || "");
                  }
                }
              }}
              disabled={Boolean(editing)}
            >
              <option value="">Select a Teacher</option>
              {allTeachers.map((r) => {
                const tUid = r.uniqueId || r.user?.uniqueId;
                if (!tUid) return null;
                const name = r.user?.name || r.name || "Unknown";
                return (
                  <option key={r._id || r.id || tUid} value={tUid}>
                    {tUid}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">Staff ID (optional)</label>
            <input
              className="mt-1 h-11 w-full rounded-2xl border border-slate-200/70 bg-white/80 px-3 text-slate-900 outline-none focus:border-[color:var(--brand)]"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="e.g., STAFF-001"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">Subjects (comma-separated)</label>
            <input
              className="mt-1 h-11 w-full rounded-2xl border border-slate-200/70 bg-white/80 px-3 text-slate-900 outline-none focus:border-[color:var(--brand)]"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="e.g., Math, Science"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800">Assigned Class</label>
            <input
              className="mt-1 h-11 w-full rounded-2xl border border-slate-200/70 bg-slate-50 px-3 text-slate-900 outline-none cursor-not-allowed text-sm"
              value={assignedClassName}
              disabled
              placeholder="No class assigned"
            />
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={successModalOpen}
        title="Success"
        onClose={() => setSuccessModalOpen(false)}
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
              onClick={() => setSuccessModalOpen(false)}
            >
              OK
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
            <svg className="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Success</h3>
            <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
              {successMessage}
            </p>
          </div>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        open={errorModalOpen}
        title="Action Failed"
        onClose={() => setErrorModalOpen(false)}
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-red-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
              onClick={() => setErrorModalOpen(false)}
            >
              OK
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Error</h3>
            <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
              {errorMessage}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
