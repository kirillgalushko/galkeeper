import { Entities } from "../entities/types";

export interface SyncRequest {
  deleted: Record<keyof Entities, Array<number>>;
  updated: Entities;
  syncedAt?: Date;
}

export interface SyncResponse {
  deleted: Record<keyof Entities, Array<number>>;
  updated: Entities;
  syncedAt: Date;
}
