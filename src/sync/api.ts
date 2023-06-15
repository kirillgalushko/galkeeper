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

export const sync = async (lastSyncedAt?: Date) => {
  const entities = await db.getAll();
  const pushData = {
    syncedAt: lastSyncedAt,
    updated: {},
    deleted: {},
  } as SyncRequest;
  for (const [collectionName, collectionEntities] of Object.entries(entities)) {
    const updatedEntities = collectionEntities
      .filter(
        (entity: Entity) =>
          !lastSyncedAt ||
          (entity.updatedAt &&
            entity.status !== "deleted" &&
            entity.updatedAt > lastSyncedAt)
      )
      .map((entity: Entity) => withoutLocalFields(entity));
    const deletedEntitiesIds = Array.from(
      new Set(
        collectionEntities
          .filter(
            (entity: BaseEntity) => entity.id && entity.status === "deleted"
          )
          .map((entity: BaseEntity) => entity.id)
      )
    ) as number[];
    pushData.updated[collectionName as keyof Entities] = updatedEntities;
    pushData.deleted[collectionName as keyof Entities] = deletedEntitiesIds;
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
  const newEntity = { ...entity };
  const oldEntity = await collection.getByIds(entity);
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
