export interface BaseCollection<T> {
  set: (entity: T) => Promise<T | undefined>;
  get: (localId: number) => Promise<T | undefined>;
  remove: (localId: number) => Promise<void>;
  getAll: () => Promise<T[]>;
  clearAll: () => Promise<void>;
}
