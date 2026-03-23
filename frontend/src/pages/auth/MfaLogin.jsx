import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';
import { roleHomePath } from '../../utils/helpers';

export default function MfaLogin() {
  const navigate = useNavigate();
  const { verifyMfa } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Get MFA user from localStorage
  const mfaUser = JSON.parse(localStorage.getItem('aas_mfa_user') || 'null');

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsVerifying(true);
      setError('');

      const result = await verifyMfa(otp);

      if (result.success) {
        console.log('MFA verification successful, redirecting to dashboard');
        navigate(roleHomePath(result.user.role), { replace: true });
      }
    } catch (error) {
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      setError('');

      // Use authService to call resend OTP
      const result = await authService.resendOTP(mfaUser?.email);
      
      if (result.success) {
        alert('OTP resent to your email!');
      } else {
        setError('Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!mfaUser) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Session Expired</h1>
            <p className="text-slate-600 mt-2">
              Please login again to continue.
            </p>
          </div>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">MFA Verification</h1>
          <p className="text-slate-600 mt-2">
            Enter the 6-digit OTP sent to your email
          </p>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ✅ OTP has been sent to <strong>{mfaUser?.email}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Please check your email (including spam folder)
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={mfaUser.email}
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isVerifying ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                onClick={handleResend}
                disabled={isResending}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
