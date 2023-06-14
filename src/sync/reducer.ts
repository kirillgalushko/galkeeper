import { createReducer } from "@reduxjs/toolkit";
import { setSyncDate } from "./actions";

type State = {
  syncedAt: Date | null;
};

const defaultState: State = {
  syncedAt: null,
};

export const syncReducer = createReducer<State>(defaultState, (builder) => {
  builder.addCase(setSyncDate, (state, action) => ({
    ...state,
    syncedAt: new Date(action.payload),
  }));
});
