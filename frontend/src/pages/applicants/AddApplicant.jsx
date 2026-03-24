import { useNavigate } from "react-router-dom";
import ApplicantForm from "../../components/forms/ApplicantForm";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import Modal from "../../components/common/Modal";
import * as applicantService from "../../services/applicantService";
import { useAuth } from "../../context/AuthContext";
import { listHeadteacherClasses } from "../../services/classService";
import { useEffect, useState } from "react";

export default function AddApplicant() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [classes, setClasses] = useState([]);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [createdApplicantId, setCreatedApplicantId] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        if (role === "headteacher" || role === "assistant_headteacher" || role === "assistantHeadteacher") {
          const data = await listHeadteacherClasses();
          const items = Array.isArray(data) ? data : data.classes || data.items || data.data || [];
          if (!ignore) setClasses(items);
        }
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    })();
    return () => { ignore = true; };
  }, [role]);

  return (
    <div className="space-y-4">
      <PageHeader title="Add Applicant" subtitle="Create a new admission application." />
      <Panel className="p-5">
        <ApplicantForm
          classes={classes}
          submitLabel="Create Applicant"
          onSubmit={async (values) => {
            try {
              const isHeadteacher = role === "headteacher" || role === "assistant_headteacher" || role === "assistantHeadteacher";
              if (!isHeadteacher) {
                setErrorMessage("You do not have permission to add applicants.");
                setErrorModalOpen(true);
                return;
              }

              const payload = {
                full_name: values.fullName,
                dob: values.dateOfBirth,
                gender: values.gender,
                class_applied: values.classApplyingFor,
                parent_name: values.parentName,
                parent_contact: values.parentContact,
                address: values.address,
              };
              const created = await applicantService.createHeadteacherApplicant(payload);
              
              const id = created?.applicant?.id || created?.applicant?._id || created?.id || created?._id;
              setCreatedApplicantId(id);
              setSuccessMessage("Applicant successfully created!");
              setSuccessModalOpen(true);
            } catch (err) {
              setErrorMessage(err.response?.data?.message || err.message || "Create failed. Check backend.");
              setErrorModalOpen(true);
            }
          }}
        />
      </Panel>

      {/* Success Modal */}
      <Modal
        open={successModalOpen}
        title="Success"
        onClose={() => {
          setSuccessModalOpen(false);
          navigate(createdApplicantId ? `/applicants/${createdApplicantId}` : "/applicants");
        }}
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
              onClick={() => {
                setSuccessModalOpen(false);
                navigate(createdApplicantId ? `/applicants/${createdApplicantId}` : "/applicants");
              }}
            >
              Continue to Match
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
