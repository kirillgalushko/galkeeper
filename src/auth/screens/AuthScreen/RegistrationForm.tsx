import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { register } from "../../api";
import { useDispatch } from "react-redux";
import { setToken } from "../../reducer";
import { setUser } from "../../../user/reducer";

type Props = {
  onLogin: () => void;
};

type FormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export const RegistrationForm = ({ onLogin }: Props) => {
  const {
    register: registerInput,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { user, access_token } = await register(data);
    dispatch(setToken(access_token));
    dispatch(setUser(user));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...registerInput("email", { required: true })} />
        {errors.email && <span>This field is required</span>}
        <input {...registerInput("password", { required: true })} />
        {errors.password && <span>This field is required</span>}

        <button type="submit">Зарегистрироваться</button>
      </form>
      <button type="button" onClick={onLogin}>
        Уже есть аккаунт
      </button>
    </>
  );
};
