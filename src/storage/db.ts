import { Note } from "../notes/note.entity";
import { NotesCollection } from "../notes/notes.collection";
import { Collection } from "./base.collection";
import { BaseEntity } from "./base.entity";
import { CollectionName } from "./types";

export class Database {
  collections: Array<Collection<BaseEntity>>;

  notesCollection: Collection<Note>;

  constructor() {
    this.notesCollection = new NotesCollection();
    this.collections = [this.notesCollection];

    for (const collection of this.collections) {
      collection.init();
    }
  }

  async getAll(skipDeletedEntities?: boolean) {
    const allEntities: Record<CollectionName, BaseEntity[]> = {} as Record<
      CollectionName,
      BaseEntity[]
    >;
    for (const collection of this.collections) {
      const entities = await collection.getAll(skipDeletedEntities);
      allEntities[collection.collectionName] = entities;
    }
    return allEntities;
  }

  async clearAll() {
    for (const collection of this.collections) {
      await collection.clearAll();
    }
  }
}

export const db = new Database();
