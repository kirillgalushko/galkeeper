import Dexie, { Table } from "dexie";
import { Note } from "../notes/note.entity";
import { BaseCollection } from "../storage/base.collection";

export class DB extends Dexie implements BaseCollection<Note> {
  notes!: Table<Note, number>;

  constructor() {
    super("DB");
    this.version(1).stores({
      notes: "++localId, &localId, &id",
    });
  }

  async get(localId: number) {
    return this.notes.get(localId);
  }

  async set(note: Note) {
    const localId = await this.notes.put(note, note.localId);
    return this.get(localId);
  }

  async remove(localId: number) {
    return this.transaction("rw", this.notes, () => {
      this.notes.delete(localId);
    });
  }

  async getAll() {
    return this.notes.toArray();
  }

  async clearAll() {
    this.transaction("rw", this.notes, async () => {
      await Promise.all(this.tables.map((table) => table.clear()));
    });
  }
}

export const notesCollection = new DB();
