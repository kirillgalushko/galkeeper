import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { register } from "../../api";
import { useDispatch } from "react-redux";
import { afterLogin } from "../../actions";
import { Grid, Button, Input, Text, Link } from "@nextui-org/react";
import { FetchError } from "../../../api/FetchError";

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
    setError,
  } = useForm<FormData>();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { user, access_token } = await register(data);
      dispatch(afterLogin({ user, token: access_token }));
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
          <Text h2>Регистрация</Text>
          <Grid xs={12}>
            <Input
              fullWidth
              placeholder="Почта"
              clearable
              size="lg"
              {...registerInput("email", { required: true })}
            />
          </Grid>
          <Grid xs={12}>
            <Input
              fullWidth
              placeholder="Пароль"
              clearable
              size="lg"
              {...registerInput("password", { required: true })}
            />
          </Grid>
          <Grid xs={12}>
            <Button auto type="submit">
              Зарегистрироваться
            </Button>
          </Grid>
          <Grid xs={12}>
            <Link type="button" onClick={onLogin}>
              Уже есть аккаунт
            </Link>
          </Grid>
          {errors.root && <Text color="error">{errors.root.message}</Text>}
        </Grid.Container>
      </form>
    </>
  );
};
