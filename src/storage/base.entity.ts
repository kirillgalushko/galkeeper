export interface BaseEntity {
  id?: number;
  localId?: number;
  status?: "created" | "updated" | "synced" | "deleted";
  updatedAt?: Date;
}

export class Entity implements BaseEntity {
  id?: BaseEntity["id"];
  localId?: BaseEntity["localId"];
  updatedAt?: BaseEntity["updatedAt"];
  status?: BaseEntity["status"];

  constructor(entity: BaseEntity) {
    this.id = entity.id;
    this.localId = entity.localId;
    this.updatedAt = entity.updatedAt ? new Date(entity.updatedAt) : new Date();
    this.status = entity.status || "created";
  }
}
