import { createReducer } from "@reduxjs/toolkit";
import { setToken, clearToken } from "./actions";

const defaultState = null;

export const authReducer = createReducer<string | null>(
  defaultState,
  (builder) => {
    builder
      .addCase(setToken, (state, action) => action.payload)
      .addCase(clearToken, (state, action) => null);
  }
);
