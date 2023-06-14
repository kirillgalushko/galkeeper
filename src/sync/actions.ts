import { createAction } from "@reduxjs/toolkit";

export const setSyncDate = createAction<Date>("SET_SYNC_DATE");
export const requestSync = createAction<void>("SYNC_REQUEST");
