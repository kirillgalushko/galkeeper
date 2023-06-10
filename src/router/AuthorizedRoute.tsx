import React from "react";
import { useSelector } from "react-redux";
import { isAuthorizedSelector } from "../auth/selectors";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { routes } from "./routes";

type Props = {
  redirectPath?: string;
} & PropsWithChildren;

export const AuthorizedRoute = ({
  redirectPath = routes.auth,
  children,
}: Props) => {
  const isAuthorized = useSelector(isAuthorizedSelector);

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
