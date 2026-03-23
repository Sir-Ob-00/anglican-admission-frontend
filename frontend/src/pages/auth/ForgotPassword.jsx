import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import { sendOTP, verifyOTP, forgotPassword, resetPassword } from "../../services/authService";
import OTPModal from "../../components/auth/OTPModal";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [step, setStep] = useState(token ? "reset" : "email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  // Step 1: Send reset link
  const handleSendResetLink = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setStep("otp");
      setShowOTPModal(true);
      setSuccess("Password reset link sent! Please check your email.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (otpCode) => {
    setLoading(true);
    setError("");

    try {
      await verifyOTP(email, otpCode);
      setSuccess("Email verified! You can now reset your password.");
      setShowOTPModal(false);
      setStep("reset");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (token) {
        // Direct reset with token
        await resetPassword(token, data.password, data.confirmPassword);
      } else {
        // Reset after OTP verification
        await resetPassword(email, data.password, data.confirmPassword);
      }
      
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      await sendOTP(email);
      setSuccess("Verification code resent!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            {token ? "Reset Password" : "Forgot Password"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {token 
              ? "Enter your new password below"
              : "Enter your email address and we'll send you a link to reset your password"
            }
          </p>
        </div>

        <div className="mt-8">
          {!token && step === "email" && (
            <Panel className="p-6">
              <form onSubmit={handleSubmit(handleSendResetLink)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address"
                      }
                    })}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <a
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Back to login
                </a>
              </div>
            </Panel>
          )}

          {step === "reset" && (
            <Panel className="p-6">
              <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => value === password || "Passwords do not match"
                    })}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <a
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Back to login
                </a>
              </div>
            </Panel>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}
        </div>

        {/* OTP Modal */}
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
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
