import api from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "jobseeker" | "recruiter";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name: string;
  phone: string;
  skills: string[];
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileData
) => {
  const response = await api.put("/auth/profile", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};