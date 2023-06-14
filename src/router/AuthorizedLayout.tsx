import React from "react";
import { createUseStyles } from "react-jss";
import { Outlet } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { clearUser } from "../user/reducer";
import { clearToken } from "../auth/reducer";

export const AuthorizedLayout = () => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const onLogout = () => {
    dispatch(clearToken());
    dispatch(clearUser());
  };

  return (
    <>
      <Outlet />
      <div className={styles.footer}>
        <Button onPress={onLogout}>Выйти</Button>
      </div>
    </>
  );
};

const useStyles = createUseStyles({
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});