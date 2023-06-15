import { Dispatch } from "react";
import { Entities } from "./types";
import { AnyAction } from "redux";
import { BaseCollection } from "../storage/base.collection";
import { requestUpdateEntities } from "./actions";
import { db } from "../storage/db";

export const getAllEntities = async (): Promise<Entities> => {
  return await db.getAll(true);
};

export const clearAllEntities = async (): Promise<void> => {
  await db.clearAll();
};

export const saveEntity = async function <T>(
  dispatch: Dispatch<AnyAction>,
  entity: T,
  collection: BaseCollection<T>
): Promise<T> {
  const oldEntity = await collection.getByIds(entity);
  const savedEntity = oldEntity
    ? await collection.update(entity)
    : await collection.add(entity);
  if (!savedEntity) {
    throw new Error(`Can\'t save the entity: ${entity}`);
  }
  dispatch(requestUpdateEntities());
  return savedEntity;
};

export const removeEntity = async function <T>(
  dispatch: Dispatch<AnyAction>,
  entity: T,
  collection: BaseCollection<T>
): Promise<void> {
  await collection.remove(entity);
  dispatch(requestUpdateEntities());
};
