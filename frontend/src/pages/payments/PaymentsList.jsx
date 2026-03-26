import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import { formatDate } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";
import * as paymentService from "../../services/paymentService";
import { getParentDashboard } from "../../services/dashboardService";

function money(n) {
  if (typeof n !== "number") return "--";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "GHS" }).format(n);
}

export default function PaymentsList() {
  const { role, user } = useAuth();
  const [rows, setRows] = useState([]);
  const [parentPaymentApplicant, setParentPaymentApplicant] = useState(null);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const normalizedRole = String(role || "").toLowerCase();
  const isParent = normalizedRole === "parent";
  const parentPaymentStatus = String(parentPaymentApplicant?.paymentStatus || "").toLowerCase();
  const parentPaymentCompleted = parentPaymentStatus === "payment_completed";
  const canInitiateParentPayment = Boolean(parentPaymentApplicant?._id) && !parentPaymentCompleted;

  async function refresh() {
    try {
      setLoadingPayments(true);
      const data = await paymentService.listPayments();
      const items = Array.isArray(data) ? data : data.items || [];
      setRows(items);
    } catch {
      setRows([]);
    } finally {
      setLoadingPayments(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        if (!ignore) setLoadingPayments(true);
        const data = await paymentService.listPayments();
        const items = Array.isArray(data) ? data : data.items || [];
        if (!ignore) setRows(items);
      } catch {
        if (!ignore) setRows([]);
      } finally {
        if (!ignore) setLoadingPayments(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isParent) return undefined;

    let ignore = false;
    (async () => {
      try {
        const data = await getParentDashboard(user?.id || user?._id);
        const applicant = data?.latestApplicant || data?.applicants?.[0] || null;
        if (!ignore) setParentPaymentApplicant(applicant);
      } catch {
        if (!ignore) setParentPaymentApplicant(null);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [isParent, user]);

  async function handleInitiatePayment() {
    if (!parentPaymentApplicant?._id) return;

    try {
      setInitializingPayment(true);
      const response = await paymentService.initializeAdmissionPayment(parentPaymentApplicant._id);
      window.location.href = response.authorization_url;
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to initialize payment");
    } finally {
      setInitializingPayment(false);
    }
  }

  const columns = useMemo(
    () => [
      {
        key: "applicant",
        header: "Applicant",
        render: (r) => r.applicant?.fullName || r.applicant || "--",
      },
      { key: "amount", header: "Amount", render: (r) => money(r.amount) },
      {
        key: "status",
        header: "Payment Status",
        render: (r) => (
          <Badge tone={r.status === "verified" ? "success" : "warning"}>
            {String(r.status).replaceAll("_", " ").toUpperCase()}
          </Badge>
        ),
      },
      { key: "method", header: "Payment Method", render: (r) => String(r.method || "--").replaceAll("_", " ") },
      { key: "date", header: "Date", render: (r) => formatDate(r.paidAt || r.createdAt || r.date) },
      {
        key: "actions",
        header: "Actions",
        render: (r) =>
          normalizedRole === "parent" && r.status !== "verified" ? (
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-2xl bg-[color:var(--brand)] px-3 text-xs font-semibold text-white hover:brightness-110"
              onClick={(e) => {
                e.stopPropagation();
                (async () => {
                  try {
                    await paymentService.verifyPayment({ paymentId: r._id || r.id });
                    await refresh();
                  } catch {
                    alert("Payment verification failed. Check backend.");
                  }
                })();
              }}
            >
              Pay
            </button>
          ) : normalizedRole === "parent" && r.status === "verified" ? (
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-2xl bg-slate-900/5 px-3 text-xs font-semibold text-slate-800 hover:bg-slate-900/10"
              onClick={(e) => {
                e.stopPropagation();
                (async () => {
                  try {
                    const blob = await paymentService.downloadReceipt(r._id || r.id);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `receipt_${r.reference || r._id || r.id}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  } catch {
                    alert("Receipt download failed.");
                  }
                })();
              }}
            >
              Receipt
            </button>
          ) : normalizedRole === "assistant_headteacher" || normalizedRole === "headteacher" ? (
            r.status !== "verified" ? (
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-2xl bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
                onClick={(e) => {
                  e.stopPropagation();
                  (async () => {
                    try {
                      await paymentService.verifyPayment({ paymentId: r._id || r.id });
                      await refresh();
                    } catch {
                      alert("Verify failed.");
                    }
                  })();
                }}
              >
                Verify
              </button>
            ) : (
              <span className="text-xs text-slate-500">--</span>
            )
          ) : (
            <span className="text-xs text-slate-500">--</span>
          ),
      },
    ],
    [normalizedRole]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Payments"
        subtitle="Track and manage admission fee payments."
        right={null}
      />
      {isParent ? (
        <Panel className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-display text-lg font-semibold text-slate-900">Initiate Payment</div>
              <div className="mt-1 text-sm text-slate-600">
                {parentPaymentApplicant
                  ? `Start payment for ${parentPaymentApplicant.fullName || "your applicant"}.`
                  : "No applicant is available for payment yet."}
              </div>
              {parentPaymentApplicant ? (
                <div className="mt-2 text-xs text-slate-500">
                  Status: {parentPaymentCompleted ? "Paid" : "Pending"}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleInitiatePayment}
              disabled={initializingPayment || !canInitiateParentPayment}
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {initializingPayment ? "Processing..." : parentPaymentCompleted ? "Payment Completed" : "Initiate Payment"}
            </button>
          </div>
        </Panel>
      ) : null}
      <Table
        title="Payments List"
        rows={rows}
        columns={columns}
        loading={loadingPayments}
        loadingText="Loading payments..."
      />
    </div>
  );
}
