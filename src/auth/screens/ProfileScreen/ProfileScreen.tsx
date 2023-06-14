import React from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../../../user/selectors";
import { useDispatch } from "react-redux";
import { logout } from "../../actions";

export const ProfileScreen = () => {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
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
