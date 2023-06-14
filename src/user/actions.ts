import { createAction } from "@reduxjs/toolkit";
import { User } from "./types";

export const setUser = createAction<User>("SET_USER");
export const clearUser = createAction<void>("CLEAR_USER");
