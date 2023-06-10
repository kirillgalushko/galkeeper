import React, { useState } from "react";
import { RegistrationForm } from "./RegistrationForm";
import { LoginForm } from "./LoginForm";
import { useSelector } from "react-redux";
import { isAuthorizedSelector } from "../../selectors";
import { Navigate } from "react-router-dom";
import { routes } from "../../../router/routes";

export const AuthScreen = () => {
  const [isRegistration, setIsRegistration] = useState<boolean>(true);
  const isAuthorized = useSelector(isAuthorizedSelector);

  if (isAuthorized) {
    return <Navigate to={routes.notes} replace={true} />;
  }

  if (isRegistration)
    return <RegistrationForm onLogin={() => setIsRegistration(false)} />;
  return <LoginForm onRegistration={() => setIsRegistration(true)} />;
};
