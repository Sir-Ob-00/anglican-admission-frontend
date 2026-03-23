import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { clearFrontendData, clearAllBackendData, resetEntireSystem, getSystemStats } from "../../services/cleanupService";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import Modal from "../../components/common/Modal";

export default function SystemReset() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await getSystemStats();
      setStats(data);
      setShowStatsModal(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load system statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFrontend = () => {
    clearFrontendData();
    logout();
    setSuccess("Frontend data cleared. You have been logged out.");
  };

  const handleClearBackend = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await clearAllBackendData();
      setSuccess(`Backend data cleared successfully! Deleted: ${JSON.stringify(result.deletedCounts)}`);
      setShowConfirmModal(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to clear backend data");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = async () => {
    setLoading(true);
    setError("");
    
    try {
      await resetEntireSystem();
      setSuccess("System reset successfully! Redirecting...");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset system");
    } finally {
      setLoading(false);
    }
  };

  const getTotalCount = () => {
    if (!stats) return 0;
    return Object.values(stats).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="System Reset"
        subtitle="Clear all data from the system"
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Frontend Data Clear */}
      <Panel className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Clear Frontend Data</h3>
        <p className="text-sm text-slate-600 mb-4">
          Clear all stored data from your browser including authentication tokens, cached data, and local storage.
        </p>
        
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-slate-700">This will clear:</p>
            <ul className="text-sm text-slate-600 mt-1 space-y-1">
              <li>• Authentication tokens</li>
              <li>• User session data</li>
              <li>• Cached application data</li>
              <li>• Local storage items</li>
              <li>• Session storage</li>
            </ul>
          </div>
          
          <button
            onClick={handleClearFrontend}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
          >
            Clear Frontend Data
          </button>
        </div>
      </Panel>

      {/* Backend Data Clear */}
      <Panel className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Clear Backend Data</h3>
        <p className="text-sm text-slate-600 mb-4">
          Permanently delete all data from the backend database. This action cannot be undone.
        </p>
        
        <div className="space-y-3">
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm font-medium text-red-700">⚠️ WARNING: This will permanently delete:</p>
            <ul className="text-sm text-red-600 mt-1 space-y-1">
              <li>• All applicants and their data</li>
              <li>• All users (except current admin)</li>
              <li>• All exams and questions</li>
              <li>• All payments and transactions</li>
              <li>• All documents and files</li>
              <li>• All notifications</li>
              <li>• All activity logs</li>
              <li>• All classes and teachers</li>
              <li>• All parent accounts</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={loadStats}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "View Statistics"}
            </button>
            
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Clear Backend Data
            </button>
          </div>
        </div>
      </Panel>

      {/* Complete System Reset */}
      <Panel className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Complete System Reset</h3>
        <p className="text-sm text-slate-600 mb-4">
          Reset the entire system by clearing both frontend and backend data. This will return the system to a clean state.
        </p>
        
        <div className="space-y-3">
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-sm font-medium text-orange-700">🔄 Complete Reset includes:</p>
            <ul className="text-sm text-orange-600 mt-1 space-y-1">
              <li>• Clear all frontend data</li>
              <li>• Delete all backend data</li>
              <li>• Log out current user</li>
              <li>• Redirect to login page</li>
            </ul>
          </div>
          
          <button
            onClick={handleResetAll}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Entire System"}
          </button>
        </div>
      </Panel>

      {/* Statistics Modal */}
      <Modal
        open={showStatsModal}
        title="System Statistics"
        onClose={() => setShowStatsModal(false)}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setShowStatsModal(false)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        }
      >
        {stats && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {getTotalCount().toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Total Records</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats).map(([key, count]) => (
                <div key={key} className="flex justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmModal}
        title="Confirm Backend Data Deletion"
        onClose={() => setShowConfirmModal(false)}
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleClearBackend}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete All Data"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Are you absolutely sure?
            </h3>
            
            <p className="text-sm text-slate-600">
              This action cannot be undone. All data will be permanently deleted from the system.
            </p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm font-medium text-red-700 mb-2">Type "DELETE" to confirm:</p>
            <input
              type="text"
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Type DELETE"
              onChange={(e) => {
                if (e.target.value === "DELETE") {
                  handleClearBackend();
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
