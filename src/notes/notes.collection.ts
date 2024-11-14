import { cryptor } from "../crypto/cryptor";
import { Note } from "../notes/note.entity";
import { Collection } from "../storage/base.collection";

type NoteCustomKeys = Exclude<
  keyof Note,
  "id" | "localId" | "updatedAt" | "status" | "cryptoFields"
>;

export class NotesCollection extends Collection<Note> {
  get collectionName() {
    return "notes" as const;
  }

  get dbVersion() {
    return 1;
  }

  get cryptoFields(): NoteCustomKeys[] {
    return ["name", "login", "password"];
  }

  async encrypt(entity: Note) {
    const encryptedEntity = { ...entity };
    for (const cryptoField of this.cryptoFields) {
      const fieldValue = entity[cryptoField];
      if (fieldValue) {
        encryptedEntity[cryptoField] = await cryptor.encrypt(fieldValue);
      }
    }
    return encryptedEntity;
  }

  async decrypt(encryptedEntity: Note) {
    const entityToDecrypt = { ...encryptedEntity };
    for (const cryptoField of this.cryptoFields) {
      const fieldValue = encryptedEntity[cryptoField];
      if (fieldValue) {
        entityToDecrypt[cryptoField] = await cryptor.decrypt(fieldValue);
      }
    }
    return entityToDecrypt;
  }
}
