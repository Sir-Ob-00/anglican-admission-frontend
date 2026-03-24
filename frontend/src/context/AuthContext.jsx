/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

function readStored() {
  const token = localStorage.getItem("aas_token");
  const rawUser = localStorage.getItem("aas_user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  return { token: token || null, user };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStored().token);
  const [user, setUser] = useState(() => readStored().user);
  const [isBooting, setIsBooting] = useState(() => Boolean(readStored().token));

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!token) {
        if (!ignore) setIsBooting(false);
        return;
      }

      if (!ignore) setIsBooting(true);
      try {
        // Get user data from localStorage (already stored during login)
        const storedUser = localStorage.getItem("aas_user");
        if (storedUser && !ignore) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch {
        if (ignore) return;
        localStorage.removeItem("aas_token");
        localStorage.removeItem("aas_user");
        setToken(null);
        setUser(null);
      } finally {
        if (!ignore) setIsBooting(false);
      }
    })();

    const handleTokenExpired = () => {
      localStorage.removeItem("aas_token");
      localStorage.removeItem("aas_user");
      localStorage.removeItem("aas_mfa_user");
      localStorage.removeItem("aas_mfa_token");
      setToken(null);
      setUser(null);
    };

    window.addEventListener("tokenExpired", handleTokenExpired);

    return () => {
      ignore = true;
      window.removeEventListener("tokenExpired", handleTokenExpired);
    };
  }, [token]);

  const value = useMemo(() => {
    const isAuthenticated = Boolean(token);

    return {
      token,
      user,
      role: user?.role || null,
      isAuthenticated,
      isBooting,
      async login(credentials) {
        try {
          const data = await authService.login(credentials);
          
          console.log("AuthContext login response:", data);
          console.log("AuthContext data.requiresMfa:", data.requiresMfa);
          console.log("AuthContext data.user?.mfa_enabled:", data.user?.mfa_enabled);
          console.log("AuthContext data.user:", data.user);
          
          // Check if MFA is required
          if (data.requiresMfa || data.user?.mfa_enabled) {
            console.log("MFA required for user:", data.user.email);
            
            // Send OTP to user's email
            try {
              console.log("Sending OTP to:", data.user.email);
              const otpResult = await authService.sendOTP(data.user.email);
              console.log("OTP send result:", otpResult);
              
              if (!otpResult.success) {
                throw new Error(otpResult.message || "Failed to send OTP");
              }
              
              console.log("OTP sent successfully");
            } catch (otpError) {
              console.error("Failed to send OTP:", otpError);
              throw new Error("Failed to send OTP. Please try again.");
            }
            
            // Store partial login info for MFA verification
            localStorage.setItem("aas_mfa_user", JSON.stringify(data.user));
            localStorage.setItem("aas_mfa_token", data.token);
            // Don't set full auth context yet - wait for MFA verification
            const mfaResponse = { requiresMfa: true, user: data.user };
            console.log("AuthContext returning MFA response:", mfaResponse);
            return mfaResponse;
          }
          
          // Normal login flow - no MFA required
          console.log("No MFA required, completing normal login");
          localStorage.setItem("aas_token", data.token);
          localStorage.setItem("aas_user", JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          console.log("User set in context:", data.user);
          return data;
        } catch (error) {
          console.error("AuthContext login error:", error);
          throw error;
        }
      },
      
      async verifyMfa(otp) {
        try {
          const mfaUser = JSON.parse(localStorage.getItem("aas_mfa_user") || "null");
          const mfaToken = localStorage.getItem("aas_mfa_token");
          
          if (!mfaUser || !mfaToken) {
            throw new Error("No MFA session found");
          }
          
          const result = await authService.verifyOTP(mfaUser.email, otp);
          
          if (result.success) {
            // MFA verified - complete login
            localStorage.setItem("aas_token", mfaToken);
            localStorage.setItem("aas_user", JSON.stringify(mfaUser));
            setToken(mfaToken);
            setUser(mfaUser);
            
            // Clean up MFA session
            localStorage.removeItem("aas_mfa_user");
            localStorage.removeItem("aas_mfa_token");
            
            console.log("MFA verified and user logged in:", mfaUser);
            return { success: true, user: mfaUser };
          } else {
            throw new Error(result.message || "Invalid OTP");
          }
        } catch (error) {
          throw error;
        }
      },
      logout() {
        localStorage.removeItem("aas_token");
        localStorage.removeItem("aas_user");
        localStorage.removeItem("aas_mfa_user");
        localStorage.removeItem("aas_mfa_token");
        setToken(null);
        setUser(null);
      },
    };
  }, [token, user, isBooting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
