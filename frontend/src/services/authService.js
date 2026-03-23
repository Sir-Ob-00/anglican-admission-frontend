import api from "./api";

export async function login({ email, password }) {
  console.log(`Login API call: POST /auth/login`);
  console.log(`Request data:`, { email, password: "***" });
  
  const res = await api.post("/auth/login", { email, password });
  
  console.log(`Login response status: ${res.status}`);
  console.log(`Login response data:`, res.data);
  console.log(`Login response structure:`, JSON.stringify(res.data, null, 2));
  
  return res.data;
}

export async function sendOTP(email) {
  const res = await api.post("/auth/send-otp", { email });
  return res.data;
}

export async function verifyOTP(email, otp) {
  const res = await api.post("/auth/verify-otp", { email, otp });
  return res.data;
}

export async function resendOTP(email) {
  const res = await api.post("/auth/resend-otp", { email });
  return res.data;
}

export async function forgotPassword(email) {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
}

export async function resetPassword(email, newPassword, confirmPassword) {
  const res = await api.post("/auth/reset-password", { 
    email, 
    newPassword, 
    confirmPassword 
  });
  return res.data;
}
