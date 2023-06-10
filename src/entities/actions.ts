import { createAction } from "@reduxjs/toolkit";
import { Entities } from "./types";

export const requestUpdateEntities = createAction<void>(
  "REQUEST_UPDATE_ENTITIES"
);
export const setEntities = createAction<Entities>("SET_ENTITIES");
