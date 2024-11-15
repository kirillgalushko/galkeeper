import React from "react";
import { Modal, Text, Button, Input } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { FetchError } from "../../api/FetchError";
import { Note, NoteInit } from "../note.entity";
import { saveEntity } from "../../entities/api";
import { db } from "../../storage/db";

type Props = {
  onClose: () => void;
  open: boolean;
  note?: Note | null;
};

export const EditNoteModal = ({ open, onClose, note }: Props) => {
  const {
    register: registerInput,
    handleSubmit,
    setError,
  } = useForm<NoteInit>({
    defaultValues: note ?? {},
  });
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<NoteInit> = async (data) => {
    try {
      const noteToSave = new Note({ ...note, ...data });
      await saveEntity(dispatch, noteToSave, db.notesCollection);
      onClose();
    } catch (e: unknown) {
      if (e instanceof FetchError) {
        setError("root", { message: e.message });
      }
    }
  };

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Новый логин
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Название"
            {...registerInput("name", { required: true })}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Логин"
            {...registerInput("login")}
          />
          <Input.Password
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Password"
            {...registerInput("password")}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={onClose}>
            Отменить
          </Button>
          <Button auto type="submit">
            Сохранить
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
