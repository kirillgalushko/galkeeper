import { Dispatch } from "react";
import { notesCollection } from "../notes/notes.collection";
import { Entities } from "./types";
import { AnyAction } from "redux";
import { BaseCollection } from "../storage/base.collection";
import { requestUpdateEntities } from "./actions";

export const getAllEntities = async (): Promise<Entities> => {
  return {
    notes: await notesCollection.getAll(),
  };
};

export const saveEntity = async function <T>(
  dispatch: Dispatch<AnyAction>,
  entity: T,
  collection: BaseCollection<T>
): Promise<T> {
  const savedEntity = await collection.set(entity);
  if (!savedEntity) {
    throw new Error(`Can\'t save the entity: ${entity}`);
  }
  dispatch(requestUpdateEntities());
  return savedEntity;
};
