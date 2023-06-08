import React from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../../../user/selectors";
import { useDispatch } from "react-redux";
import { clearToken } from "../../reducer";
import { clearUser } from "../../../user/reducer";

export const ProfileScreen = () => {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(clearToken());
    dispatch(clearUser());
  };

  return (
    <>
      {JSON.stringify(user)}
      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </>
  );
};
