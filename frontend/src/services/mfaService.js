import api from './api';

export async function verifyMfa(email, otp) {
  const response = await api.post('/auth/verify-mfa', {
    email,
    otp
  });
  return response.data;
}

export async function resendOtp(email) {
  const response = await api.post('/auth/resend-otp', {
    email
  });
  return response.data;
}
