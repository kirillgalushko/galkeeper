import { entitiesSelector } from "../entities/selectors";
import { RootState } from "../storage/redux";

export const notesSelector = (state: RootState) =>
  entitiesSelector(state).notes;
