import authClient from './axios'; // Đảm bảo đường dẫn này đúng

export const sendVerificationCode = async (data) => {
  // data nên chứa { email, type }
  const response = await authClient.post('/auth/send-verification-code', data);
  return response.data;
};

export const register = async (data) => {
  const response = await authClient.post('/auth/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await authClient.post('/auth/login', data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await authClient.post('/auth/reset-password', data);
  return response.data;
};