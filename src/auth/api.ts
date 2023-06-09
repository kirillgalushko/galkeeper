import { post } from "../api/http";
import { User } from "../user/User";

export const login = async (data: { email: string; password: string }) => {
  return await post("/auth/login", data);
};

export const register = async (data: User) =>
  await post("/auth/register", data);
