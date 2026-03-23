import { useState } from "react";
import { sendOTP, verifyOTP, resendOTP } from "../../services/authService";
import OTPModal from "../../components/auth/OTPModal";

export default function OTPTest() {
  const [email, setEmail] = useState("fortesting8177@gmail.com");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendOTP(email);
      setShowModal(true);
      setSuccess("OTP sent successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    setLoading(true);
    setError("");

    try {
      await verifyOTP(email, otpCode);
      setSuccess("OTP verified successfully!");
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      await resendOTP(email);
      setSuccess("OTP resent successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">OTP Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">OTP Verification Test</h2>
          <p className="text-slate-600 mb-4">
            Test the OTP verification flow with your email address.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter email address"
              />
            </div>
            
            <button
              onClick={handleSendOTP}
              disabled={loading || !email}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
            
            {error && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-slate-700">Test Instructions:</p>
            <ul className="text-sm text-slate-600 mt-2 space-y-1">
              <li>• Enter your email address</li>
              <li>• Click "Send OTP" to receive verification code</li>
              <li>• Enter the 6-digit code in the modal</li>
              <li>• Test resend functionality after timer expires</li>
              <li>• Check error handling with invalid codes</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">API Endpoints Tested</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>POST /auth/send-otp</div>
            <div>POST /auth/verify-otp</div>
            <div>POST /auth/resend-otp</div>
          </div>
        </div>

        <OTPModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setError("");
            setSuccess("");
          }}
          email={email}
          onVerified={handleVerifyOTP}
          loading={loading}
          error={error}
          success={success}
          onResend={handleResendOTP}
        />
      </div>
    </div>
  );
}
