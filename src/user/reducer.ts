import { createAction, createReducer } from "@reduxjs/toolkit";
import { User } from "./types";

export const setUser = createAction<User>("SET_USER");
export const clearUser = createAction<void>("CLEAR_USER");

const defaultState = null;

export const userReducer = createReducer<User | null>(
  defaultState,
  (builder) => {
    builder
      .addCase(setUser, (state, action) => action.payload)
      .addCase(clearUser, (state, action) => null);
  }
);
