import React, { useState } from "react";
import { Card, Button, Text } from "@nextui-org/react";
import { createUseStyles } from "react-jss";
import { EditNoteModal } from "../components/EditNoteModal";
import { useSelector } from "react-redux";
import { notesSelector } from "../selectors";
import { useDispatch } from "react-redux";
import { removeEntity } from "../../entities/api";
import { Note } from "../note.entity";
import { db } from "../../storage/db";
import { requestSync } from "../../sync/actions";
import { sortBy } from "lodash";

export const NotesScreen = () => {
  const notes = useSelector(notesSelector);
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isCreatingNote, setIsCreatingNote] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const onCreateNote = () => {
    setIsCreatingNote(true);
  };

  const onRemoveNote = (note: Note) => {
    removeEntity(dispatch, note, db.notesCollection);
  };

  const onEditNote = (note: Note) => {
    setEditingNote(note);
    setIsCreatingNote(true);
  };

  const onSync = () => {
    dispatch(requestSync());
  };

  return (
    <div className={styles.root}>
      {sortBy(notes, ["id"]).map((note) => (
        <Card key={note.localId}>
          <Card.Body>
            <div className={styles.card}>
              <span>
                <Text h3>{note.id}</Text>
                <Text>
                  {note.name} - {note.login} - {note.password}
                </Text>
              </span>
              <Button auto onPress={() => onEditNote(note)}>
                Edit
              </Button>
              <Button auto onPress={() => onRemoveNote(note)}>
                X
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}

      <Button onClick={onCreateNote}>Создать логин</Button>

      <Button auto onPress={onSync}>
        Sync
      </Button>

      {isCreatingNote && (
        <EditNoteModal
          open={isCreatingNote}
          onClose={() => {
            setEditingNote(null);
            setIsCreatingNote(false);
          }}
          note={editingNote}
        />
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    lineBreak: "anywhere",
  },
});
