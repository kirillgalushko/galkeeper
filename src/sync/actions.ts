import { createAction } from "@reduxjs/toolkit";

export const setSyncDate = createAction<Date>("SET_SYNC_DATE");
export const clearSyncDate = createAction<void>("CLEAR_SYNC_DATE");
export const requestSync = createAction<void>("SYNC_REQUEST");
export const requestSoftSync = createAction<void>("SOFT_SYNC_REQUEST");
export const syncSuccess = createAction<void>("SYNC_SUCCESS");
