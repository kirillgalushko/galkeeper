import { post } from "../api/http";
import { Entities } from "../entities/types";
import { Collection } from "../storage/base.collection";
import { BaseEntity, Entity } from "../storage/base.entity";
import { db } from "../storage/db";
import { SyncRequest, SyncResponse } from "./types";

const withoutLocalFields = (entity: BaseEntity) => {
  const copy = { ...entity };
  const fieldsToRemove = ["status"];
  if (copy.id) {
    fieldsToRemove.push("localId");
  }
  for (const fieldToRemove of fieldsToRemove) {
    delete copy[fieldToRemove as keyof BaseEntity];
  }
  return copy;
};

const syncRequest = async (data: SyncRequest): Promise<SyncResponse> =>
  await post("/sync", data);

const isUpdatedEntity = (entity: BaseEntity, since?: Date) =>
  !since ||
  (entity.updatedAt && entity.status !== "deleted" && entity.updatedAt > since);

const isDeletedEntity = (entity: BaseEntity) =>
  entity.id && entity.status === "deleted";

export const sync = async (lastSyncedAt?: Date) => {
  // const entities = await db.getAll();
  const pushData = {
    syncedAt: lastSyncedAt,
    updated: {},
    deleted: {},
  } as SyncRequest;
  for (const collection of db.collections) {
    pushData.updated[collection.collectionName] = [];
    pushData.deleted[collection.collectionName] = [];
    const collectionEntities = await collection.getAll();
    for (const entity of collectionEntities) {
      if (isUpdatedEntity(entity, lastSyncedAt)) {
        // @ts-expect-error TODO:
        const encryptedEntity = await collection.encrypt(entity);
        pushData.updated[collection.collectionName].push(
          withoutLocalFields(encryptedEntity)
        );
      }

      if (isDeletedEntity(entity)) {
        pushData.deleted[collection.collectionName].push(entity.id as number);
      }
    }
  }
  const syncedData = await syncRequest(pushData);
  return await saveSyncResponse(syncedData);
};

export const saveSyncResponse = async (data: SyncResponse) => {
  const promisesToDelete = db.collections
    .filter(
      (collection: Collection<BaseEntity>) =>
        data.deleted[collection.collectionName]
    )
    .map((collection: Collection<BaseEntity>) => {
      const deletedEntitiesIds = data.deleted[collection.collectionName];
      return deletedEntitiesIds.map((id) => collection.destroy({ id }));
    });

  const promisesToUpdate = db.collections
    .filter(
      (collection: Collection<BaseEntity>) =>
        data.updated[collection.collectionName]
    )
    .map((collection: Collection<BaseEntity>) => {
      const updatedEntities = data.updated[collection.collectionName];
      return updatedEntities.map((entity) => setSyncEntity(entity, collection));
    });

  await Promise.all([...promisesToDelete, ...promisesToUpdate].flat());
  return data.syncedAt;
};

export const setSyncEntity = async (
  entity: BaseEntity,
  collection: Collection<BaseEntity>
) => {
  // @ts-expect-error
  const decryptedEntity = await collection.decrypt(entity);
  const newEntity = { ...decryptedEntity };
  const oldEntity = await collection.getByIds(decryptedEntity);
  if (oldEntity?.status === "synced") {
    delete newEntity.localId;
  }
  const updatedEntity = {
    ...oldEntity,
    ...newEntity,
    status: "synced" as const,
  };
  return await collection.rewrite(updatedEntity);
};
