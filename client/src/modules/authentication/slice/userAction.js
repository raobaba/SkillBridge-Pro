import fetchFromApiServer from "../../../services/api";

export const loginUserApi = async (data) => {
  const url = `api/v1/user/login`;
  return await fetchFromApiServer("POST", url, data);
};

export const registerUserApi = async (data) => {
  const url = `api/v1/user/register`;
  return await fetchFromApiServer("POST", url, data);
};

export const changeCurrentPassword = async (data) => {
  const url = `api/v1/user/change-password`;
  return await fetchFromApiServer("PUT", url, data);
};

export const forgetPassword = async (data) => {
  const url = `api/v1/user/forgot-password`;
  return await fetchFromApiServer("POST", url, data);
};

export const resetPassword = async ({ token, password }) => {
  const url = `api/v1/user/reset-password/${token}`;
  return await fetchFromApiServer("PUT", url, { newPassword: password });
};

export const updateUserProfileApi = async (formData) => {
  const url = `api/v1/user/profile`;
  return await fetchFromApiServer("MULTIPART_PUT", url, formData);
};

export const getUserProfileApi = async () => {
  const url = `api/v1/user/profile`;
  return await fetchFromApiServer("GET", url);
};

export const deleteUserProfileApi = async () => {
  const url = `api/v1/user/profile`;
  return await fetchFromApiServer("DELETE", url);
};

export const emailVerification = async (token) => {
  const url = `api/v1/user/verify-email?token=${token}`;
  return await fetchFromApiServer("GET", url);
};

export const updateOAuthDetailsApi = async (data) => {
  const url = `api/v1/user/oauth`;
  return await fetchFromApiServer("PUT", url, data);
};

export const logoutApi = async () => {
  const url = `api/v1/user/logout`;
  return await fetchFromApiServer("POST", url);
};
