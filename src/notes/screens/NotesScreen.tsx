import React, { useState } from "react";
import { Card, Button } from "@nextui-org/react";
import { createUseStyles } from "react-jss";
import { CreateNoteModal } from "../components/CreateNoteModal";
import { useSelector } from "react-redux";
import { notesSelector } from "../selectors";

export const NotesScreen = () => {
  const notes = useSelector(notesSelector);
  const styles = useStyles();
  const [isCreatingNote, setIsCreatingNote] = useState<boolean>(false);

  const onCreateNote = () => {
    setIsCreatingNote(true);
  };

  return (
    <div className={styles.root}>
      {notes.map((note) => (
        <Card key={note.localId}>
          <Card.Body>{note.name}</Card.Body>
        </Card>
      ))}

      <Button onClick={onCreateNote}>Создать логин</Button>
      <CreateNoteModal
        open={isCreatingNote}
        onClose={() => setIsCreatingNote(false)}
      />
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
});
