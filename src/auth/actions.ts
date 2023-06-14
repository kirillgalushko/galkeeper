import { createAction } from "@reduxjs/toolkit";

export const setToken = createAction<string>("SET_TOKEN");
export const clearToken = createAction<void>("CLEAR_TOKEN");

export const logout = createAction<void>("LOGOUT");
