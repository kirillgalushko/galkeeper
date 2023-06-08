import { RootState } from "../store";

export const isAuthorizedSelector = (state: RootState) => !!state.auth;
