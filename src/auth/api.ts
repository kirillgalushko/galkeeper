import { post } from "../api/http";
import { User } from "../user/types";

export const login = async (data: { email: string; password: string }) => {
  return await post("/auth/login", data);
};

export const register = async (data: Omit<User, "id">) => {
  return post("/auth/register", data);
};
