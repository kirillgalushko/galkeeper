import { RootState } from "../storage/redux";

export const isAuthorizedSelector = (state: RootState) => !!state.auth;
