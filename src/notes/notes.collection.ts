import { Note } from "../notes/note.entity";
import { Collection } from "../storage/base.collection";

export class NotesCollection extends Collection<Note> {
  get collectionName() {
    return "notes" as const;
  }

  get dbVersion() {
    return 1;
  }
}
