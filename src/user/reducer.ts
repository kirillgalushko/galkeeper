import { createReducer } from "@reduxjs/toolkit";
import { setUser } from "./actions";
import { clearUser } from "./actions";
import { User } from "./types";

const defaultState = null;

export const userReducer = createReducer<User | null>(
  defaultState,
  (builder) => {
    builder
      .addCase(setUser, (state, action) => action.payload)
      .addCase(clearUser, (state, action) => null);
  }
);
