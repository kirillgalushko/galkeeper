import { BaseEntity } from "../storage/base.entity";

export interface NoteInit extends BaseEntity {
  readonly name?: string;
  readonly login?: string;
  readonly password?: string;
}

export class Note implements NoteInit {
  id?: number;
  localId?: number;
  name?: string;
  login?: string;
  password?: string;

  constructor(note: NoteInit) {
    this.id = note.id;
    this.localId = note.localId;
    this.name = note.name;
    this.login = note.login;
    this.password = note.password;
  }
}
