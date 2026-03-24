import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listNotifications } from "../../services/notificationService";
import { cx, formatDate } from "../../utils/helpers";
import Modal from "../common/Modal";

function roleLabel(role) {
  const normalizedRole = role?.toLowerCase();
  switch (normalizedRole) {
    case "admin":
      return "Admin";
    case "headteacher":
      return "Headteacher";
    case "assistant_headteacher":
      return "Assistant Head";
    case "teacher":
      return "Class Teacher";
    default:
      return "Parent";
  }
}

export default function Navbar({ onToggleSidebar }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await listNotifications({ limit: 5 });
        if (!ignore) setItems(Array.isArray(data) ? data : data.items || []);
      } catch {
        if (!ignore) setItems([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  return (
      <header className="sticky top-3 z-20">
        <div className="flex items-center gap-3 rounded-3xl border border-white/40 bg-white/60 px-3 py-3 shadow-lg backdrop-blur-xl md:px-4">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-800 md:hidden"
          onClick={onToggleSidebar}
          aria-label="Open sidebar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0">
          <div className="font-display text-lg font-semibold text-slate-900 md:text-xl">Anglican School</div>
          <div className="truncate text-xs text-slate-600">{roleLabel(role)} dashboard and workflows</div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              className={cx(
                "relative inline-flex h-10 items-center justify-center rounded-2xl px-3 text-sm",
                "bg-slate-900/5 text-slate-800 hover:bg-slate-900/10"
              )}
              onClick={() => setOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="ml-2 hidden font-semibold md:inline">Alerts</span>
              <span
                className={cx(
                  "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold text-white",
                  unreadCount > 0 ? "bg-[color:var(--brand)]" : "bg-slate-400"
                )}
                aria-label={`Unread notifications: ${unreadCount}`}
              >
                {unreadCount}
              </span>
            </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-md">
              <h4 className="font-semibold text-slate-900">Notifications</h4>
              <div className="mt-2 space-y-2">
                {items.length ? (
                  items.map((item) => (
                    <div key={item._id} className="rounded-2xl bg-white/60 p-3">
                      <div className="font-semibold text-slate-900">{item.title || 'Notification'}</div>
                      <div className="mt-1 text-xs text-slate-600">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-white/60 p-3 text-slate-600">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden rounded-2xl bg-white/60 px-3 py-2 text-sm text-slate-700 md:block">
          <div className="font-semibold text-slate-900">{user?.name || "User"}</div>
          <div className="text-xs">{roleLabel(role)}</div>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-2xl bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm hover:brightness-110"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
        </div>
      </div>
    </header>
  );
}
