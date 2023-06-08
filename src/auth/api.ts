import { api } from "../api/api";
import { User } from "../user/User";

export const login = (data: { email: string; password: string }) => {
  return api.post("/auth/login", data);
};

export const register = (data: User) => api.post("/auth/register", data);
