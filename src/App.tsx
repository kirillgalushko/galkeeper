import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { useDarkMode } from "./utils";
import { useSelector } from "react-redux";
import { isAuthorizedSelector } from "./auth/selectors";
import { AuthScreen } from "./auth/screens/AuthScreen/AuthScreen";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "./store";
import { ProfileScreen } from "./auth/screens/ProfileScreen/ProfileScreen";

const lightTheme = createTheme({
  type: "light",
});

const darkTheme = createTheme({
  type: "dark",
});

const App = () => {
  const isAuthorized = useSelector(isAuthorizedSelector);

  if (isAuthorized) return <ProfileScreen />;
  return <AuthScreen />;
};

const AppWithProviders = () => {
  const isDarkMode = useDarkMode();
  return (
    <ReduxProvider store={store}>
      <NextUIProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </NextUIProvider>
    </ReduxProvider>
  );
};

export default AppWithProviders;
