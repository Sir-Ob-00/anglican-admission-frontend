import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Modal from "../common/Modal";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (location.state?.loggedIn) {
      setShowLoginModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-full">
      <div className="mx-auto flex min-h-full w-full max-w-[1400px] gap-4 px-3 py-3 md:px-4 md:py-4">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
          <main className="mt-4 min-w-0 flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>

      <Modal
        open={showLoginModal}
        title="Login Successful"
        onClose={() => setShowLoginModal(false)}
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--brand)] px-5 text-sm font-semibold text-white hover:brightness-110"
              onClick={() => setShowLoginModal(false)}
            >
              Continue
            </button>
          </div>
        }
      >
        <div className="text-sm text-slate-600">Welcome to your dashboard! You have successfully signed in.</div>
      </Modal>
    </div>
  );
}
