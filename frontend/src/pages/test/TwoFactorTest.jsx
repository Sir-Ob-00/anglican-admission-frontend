import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TwoFactorModal from "../../components/auth/TwoFactorModal";

export default function TwoFactorTest() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (code) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (code === "123456") {
        setSuccess("2FA verification successful!");
        setTimeout(() => {
          setShowModal(false);
        }, 1500);
      } else {
        setError("Invalid verification code. Try 123456 for demo.");
      }
    } catch (err) {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">2FA Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Two-Factor Authentication Demo</h2>
          <p className="text-slate-600 mb-4">
            This page demonstrates the 2FA modal functionality. Click the button below to test the verification flow.
          </p>
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test 2FA Modal
          </button>
          
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-slate-700">Demo Instructions:</p>
            <ul className="text-sm text-slate-600 mt-2 space-y-1">
              <li>• Click the button to open the 2FA modal</li>
              <li>• Enter "123456" to simulate successful verification</li>
              <li>• Enter any other 6-digit code to see error handling</li>
              <li>• Try the backup code and help options</li>
            </ul>
          </div>
        </div>

        <TwoFactorModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setError("");
            setSuccess("");
          }}
          onVerify={handleVerify}
          loading={loading}
          error={error}
          success={success}
        />
      </div>
    </div>
  );
}
