import { RootState } from "../storage/redux";

export const syncedAtSelector = (state: RootState) =>
  state.sync.syncedAt ? new Date(state.sync.syncedAt) : null;
