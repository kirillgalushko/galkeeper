import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { login } from "../../api";
import { useDispatch } from "react-redux";
import { setToken } from "../../reducer";
import { setUser } from "../../../user/reducer";

type Props = {
  onRegistration: () => void;
};

type FormData = {
  email: string;
  password: string;
};

export const LoginForm = ({ onRegistration }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { user, access_token } = await login(data);
    dispatch(setToken(access_token));
    dispatch(setUser(user));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email", { required: true })} />
        {errors.email && <span>This field is required</span>}
        <input {...register("password", { required: true })} />
        {errors.password && <span>This field is required</span>}

        <button type="submit">Войти</button>
      </form>
      <button type="button" onClick={onRegistration}>
        Зарегистрироваться
      </button>
    </>
  );
};
