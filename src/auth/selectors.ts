import { RootState } from "../storage/redux";

export const authTokenSelector = (state: RootState) => state.auth;
export const isAuthorizedSelector = (state: RootState) =>
  !!authTokenSelector(state);
