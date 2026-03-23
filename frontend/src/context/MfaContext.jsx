import { createContext, useContext, useState } from 'react';

const MfaContext = createContext();

export function MfaProvider({ children }) {
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaEmail, setMfaEmail] = useState('');
  const [mfaOtp, setMfaOtp] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);

  const value = {
    showMfaModal,
    setShowMfaModal,
    mfaEmail,
    setMfaEmail,
    mfaOtp,
    setMfaOtp,
    mfaError,
    setMfaError,
    isVerifyingMfa,
    setIsVerifyingMfa,
  };

  return <MfaContext.Provider value={value}>{children}</MfaContext.Provider>;
}

export function useMfa() {
  const ctx = useContext(MfaContext);
  if (!ctx) throw new Error('useMfa must be used within MfaProvider');
  return ctx;
}
