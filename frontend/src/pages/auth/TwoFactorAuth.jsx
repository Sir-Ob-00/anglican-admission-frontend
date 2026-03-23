import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";

export default function TwoFactorAuth() {
  const { user, verify2FA, enable2FA, disable2FA } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await verify2FA(code);
      setSuccess("2FA verification successful! You are now logged in.");
      setTimeout(() => {
        // Redirect to dashboard or home
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await enable2FA();
      setQrCode(response.qrCode);
      setSecret(response.secret);
      setShowEnableModal(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to setup 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEnable = async () => {
    if (!code || code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await enable2FA({ code, secret });
      setSuccess("2FA enabled successfully!");
      setShowEnableModal(false);
      setCode("");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm("Are you sure you want to disable 2FA? This will make your account less secure.")) {
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await disable2FA();
      setSuccess("2FA disabled successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Two-Factor Authentication"
        subtitle="Add an extra layer of security to your account"
      />

      {/* 2FA Verification Modal */}
      <Modal
        open={true}
        title="Two-Factor Authentication"
        onClose={() => {}}
        showCloseButton={false}
        footer={null}
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Enter Verification Code
            </h3>
            
            <p className="text-sm text-slate-600 mb-4">
              Open your authenticator app and enter the 6-digit code to complete the sign-in process.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Authentication Code
              </label>
              <input
                type="text"
                maxLength={6}
                pattern="[0-9]{6}"
                className="w-full h-12 text-center text-2xl font-mono rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                disabled={loading}
                autoFocus
              />
              <p className="mt-2 text-xs text-slate-500 text-center">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full h-11 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600">
            <p>Can't access your authenticator app?</p>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => {
                // Handle backup code or recovery process
                alert("Contact administrator for account recovery");
              }}
            >
              Use backup code
            </button>
          </div>
        </div>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal
        open={showEnableModal}
        title="Enable Two-Factor Authentication"
        onClose={() => setShowEnableModal(false)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              onClick={() => setShowEnableModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmEnable}
              disabled={loading || code.length !== 6}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Enabling..." : "Enable 2FA"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Setup Two-Factor Authentication
            </h3>
            
            <p className="text-sm text-slate-600 mb-4">
              Scan the QR code below with your authenticator app to enable 2FA.
            </p>
          </div>

          {qrCode && (
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className="w-48 h-48" />
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-1">Manual Entry Key:</p>
            <code className="text-xs text-slate-600 break-all">{secret}</code>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              pattern="[0-9]{6}"
              className="w-full h-12 text-center text-2xl font-mono rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              disabled={loading}
            />
            <p className="mt-2 text-xs text-slate-500 text-center">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
        </div>
      </Modal>

      {/* 2FA Management Panel */}
      <Panel className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-600 mt-1">
                Add an extra layer of security to your account with 2FA.
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              user?.twoFactorEnabled 
                ? "bg-green-100 text-green-800" 
                : "bg-slate-100 text-slate-800"
            }`}>
              {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            {user?.twoFactorEnabled ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">2FA is currently enabled</span>
                </div>
                
                <p className="text-sm text-slate-600">
                  Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app when signing in.
                </p>
                
                <button
                  onClick={handleDisable2FA}
                  disabled={loading}
                  className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
                >
                  {loading ? "Disabling..." : "Disable 2FA"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-medium">2FA is currently disabled</span>
                </div>
                
                <p className="text-sm text-slate-600">
                  Enable two-factor authentication to add an extra layer of security to your account.
                </p>
                
                <button
                  onClick={handleSetup2FA}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Setting up..." : "Enable 2FA"}
                </button>
              </div>
            )}
          </div>
        </div>
      </Panel>

      {/* Recovery Options */}
      <Panel className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recovery Options</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-900">Backup Codes</p>
              <p className="text-xs text-slate-600">Generate backup codes for account recovery</p>
            </div>
            <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
              Generate
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-900">Recovery Email</p>
              <p className="text-xs text-slate-600">Set up recovery email for account access</p>
            </div>
            <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
              Configure
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
