import { createAction, createReducer } from "@reduxjs/toolkit";

export const setToken = createAction<string>("SET_TOKEN");
export const clearToken = createAction<void>("CLEAR_TOKEN");

const defaultState = null;

export const authReducer = createReducer<string | null>(
  defaultState,
  (builder) => {
    builder
      .addCase(setToken, (state, action) => action.payload)
      .addCase(clearToken, (state, action) => null);
  }
);
