import Dexie, { Table } from "dexie";
import { BaseEntity } from "../storage/base.entity";
import { CollectionName } from "./types";

export interface BaseCollection<T> {
  readonly collectionName: string;
  readonly dbVersion: number;

  add: (entity: T) => Promise<T | undefined>;
  update: (entity: T) => Promise<T | undefined>;
  getByIds: (entity: T) => Promise<T | null>;
  remove: (entity: T) => Promise<void>;
  destroy: (entity: T) => Promise<void>;
  rewrite: (entity: T) => Promise<T | undefined>;
  getAll: (skipDeletedEntities?: boolean) => Promise<T[]>;
  clearAll: () => Promise<void>;
}

export abstract class Collection<EntityType extends BaseEntity>
  implements BaseCollection<EntityType>
{
  db?: Dexie;
  collection!: Table<EntityType, number>;

  abstract get collectionName(): CollectionName;

  abstract get dbVersion(): number;

  async init(): Promise<void> {
    this.db = new Dexie(this.collectionName);
    this.db.version(this.dbVersion).stores({
      [this.collectionName]: "++localId, &localId, &id",
    });
    this.collection = this.db.table(this.collectionName);
  }

  async getByRemoteId(remoteId: number) {
    return this.collection.get({ id: remoteId });
  }

  async getByLocalId(localId: number) {
    return this.collection.get(localId);
  }

  async getByIds(entity: EntityType) {
    const { id, localId } = entity;
    return (
      (!!id && (await this.getByRemoteId(id))) ||
      (!!localId && (await this.getByLocalId(localId))) ||
      null
    );
  }

  async add(entity: EntityType) {
    entity.updatedAt = new Date();
    const newEntityLocalId = await this.collection.add(entity);
    return this.getByLocalId(newEntityLocalId);
  }

  async update(entity: EntityType) {
    entity.updatedAt = new Date();
    entity.status = "updated";
    return this.rewrite(entity);
  }

  async remove(entity: EntityType) {
    if (!entity.id) {
      return this.destroy(entity);
    }
    await this.rewrite({ ...entity, status: "deleted", updatedAt: new Date() });
  }

  async destroy(entity: EntityType) {
    const entityToRemove = await this.getByIds(entity);
    if (entityToRemove?.localId) {
      return this.collection.delete(entityToRemove.localId);
    }
  }

  async rewrite(entity: EntityType) {
    const updatedEntityLocalId = await this.collection.put(
      entity,
      entity.localId
    );
    return this.getByLocalId(updatedEntityLocalId);
  }

  async getAll(skipDeletedEntities?: boolean) {
    if (skipDeletedEntities) {
      return this.collection
        .filter((entity) => entity.status != "deleted")
        .toArray();
    }
    return this.collection.toArray();
  }

  async clearAll() {
    return this.collection.clear();
  }
}
