import { useState, useEffect } from "react";
import Modal from "../common/Modal";

export default function LoginOTPModal({ isOpen, onClose, email, onVerified, loading, error, success }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [isOpen, timeLeft]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit if all digits are entered
    if (newOtp.every(digit => digit !== "")) {
      const otpCode = newOtp.join("");
      onVerified(otpCode);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`login-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);
    
    // Focus the last filled input
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex >= 0) {
      const input = document.getElementById(`login-otp-${lastFilledIndex}`);
      if (input) input.focus();
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    // Trigger resend OTP callback
    onResend && onResend();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      open={isOpen}
      title="Two-Factor Authentication"
      onClose={onClose}
      showCloseButton={false}
      footer={null}
      size="sm"
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
            Two-factor authentication is enabled for your account.
            <br />
            We've sent a 6-digit verification code to:
            <br />
            <span className="font-medium text-slate-900">{email}</span>
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Authentication Code
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`login-otp-${index}`}
                  type="text"
                  maxLength={1}
                  pattern="[0-9]"
                  className="w-12 h-12 text-center text-xl font-mono rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="text-center space-y-2">
            {!canResend ? (
              <p className="text-sm text-slate-600">
                Resend code in <span className="font-medium text-blue-600">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
              >
                Resend verification code
              </button>
            )}
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              Can't access your email?
            </p>
            <div className="space-x-4">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                onClick={() => {
                  alert("Contact administrator for account recovery");
                }}
              >
                Need help?
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Security Notice:</strong> This extra step protects your account even if someone knows your password.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
