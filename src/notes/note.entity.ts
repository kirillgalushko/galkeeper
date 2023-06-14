import { BaseEntity, Entity } from "../storage/base.entity";

export interface NoteInit extends BaseEntity {
  readonly name?: string;
  readonly login?: string;
  readonly password?: string;
}

export class Note extends Entity implements NoteInit {
  name?: string;
  login?: string;
  password?: string;

  constructor(note: NoteInit) {
    super(note);
    this.name = note.name;
    this.login = note.login;
    this.password = note.password;
  }
}
