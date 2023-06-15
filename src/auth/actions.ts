import { createAction } from "@reduxjs/toolkit";
import { User } from "../user/types";

export const setToken = createAction<string>("SET_TOKEN");
export const clearToken = createAction<void>("CLEAR_TOKEN");

export const afterLogin = createAction<{ token: string; user: User }>(
  "AFTER_LOGIN"
);
export const logout = createAction<void>("LOGOUT");
