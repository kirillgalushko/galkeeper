import React, { useState } from "react";
import { RegistrationForm } from "./RegistrationForm";
import { LoginForm } from "./LoginForm";

export const AuthScreen = () => {
  const [isRegistration, setIsRegistration] = useState<boolean>(true);
  if (isRegistration)
    return <RegistrationForm onLogin={() => setIsRegistration(false)} />;
  return <LoginForm onRegistration={() => setIsRegistration(true)} />;
};
