import { createReducer } from "@reduxjs/toolkit";
import { setEntities } from "./actions";
import { Entities } from "./types";

const defaultState: Entities = {
  notes: [],
};

export const entitiesReducer = createReducer<Entities>(
  defaultState,
  (builder) => {
    builder.addCase(setEntities, (state, action) => action.payload);
  }
);
