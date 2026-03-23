import { useState } from "react";
import Modal from "../common/Modal";

export default function TwoFactorModal({ isOpen, onClose, onVerify, loading, error, success }) {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCode(value);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    setCode(pastedData.slice(0, 6));
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Authentication Code
            </label>
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  pattern="[0-9]"
                  className="w-12 h-12 text-center text-xl font-mono rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  value={code[index] || ""}
                  onChange={(e) => {
                    const newCode = code.split('');
                    newCode[index] = e.target.value;
                    setCode(newCode.join(''));
                    if (e.target.value && index < 5) {
                      const nextInput = e.target.parentElement.children[index + 1];
                      if (nextInput) nextInput.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !code[index] && index > 0) {
                      const prevInput = e.target.parentElement.children[index - 1];
                      if (prevInput) prevInput.focus();
                    }
                  }}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500 text-center">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full h-11 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-slate-600">
            Can't access your authenticator app?
          </p>
          <div className="space-x-4">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              onClick={() => {
                // Handle backup code option
                alert("Backup code feature coming soon");
              }}
            >
              Use backup code
            </button>
            <span className="text-slate-400">•</span>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              onClick={() => {
                // Handle recovery option
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
                  <strong>Tip:</strong> Popular authenticator apps include Google Authenticator, Microsoft Authenticator, or Authy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
