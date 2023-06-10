import { post, get } from "../api/http";
import { Note } from "./note.entity";

export const createNote = async (data: Note) =>
  await post("/notes/create", data);

export const getNotes = async () => await get("/notes/bulk");
