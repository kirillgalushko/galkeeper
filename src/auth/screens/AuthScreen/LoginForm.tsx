import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { login } from "../../api";
import { useDispatch } from "react-redux";
import { setToken } from "../../reducer";
import { setUser } from "../../../user/reducer";
import { Grid, Button, Input, Text, Link } from "@nextui-org/react";
import { FetchError } from "../../../api/FetchError";

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
    setError,
  } = useForm<FormData>();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { user, access_token } = await login(data);
      dispatch(setToken(access_token));
      dispatch(setUser(user));
    } catch (e: unknown) {
      if (e instanceof FetchError) {
        setError("root", { message: e.message });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid.Container gap={2} justify="center" alignItems="center">
          <Text h2>Войти в аккаунт</Text>
          <Grid xs={12}>
            <Input
              fullWidth
              placeholder="Почта"
              clearable
              size="lg"
              {...register("email", { required: true })}
            />
            {errors.email && <span>This field is required</span>}
          </Grid>
          <Grid xs={12}>
            <Input
              fullWidth
              placeholder="Пароль"
              clearable
              size="lg"
              {...register("password", { required: true })}
            />
            {errors.password && <span>This field is required</span>}
          </Grid>
          <Grid xs={12}>
            <Button type="submit">Войти</Button>
          </Grid>
          {errors.root && <Text color="error">{errors.root.message}</Text>}
          <Grid xs={12}>
            <Link type="button" onClick={onRegistration}>
              У меня нет аккаунта
            </Link>
          </Grid>
        </Grid.Container>
      </form>
    </>
  );
};
