import React, { useEffect } from "react";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { useDarkMode } from "./hooks/useDarkMode";
import { store } from "./storage/redux";
import { Router } from "./router";
import { useDispatch } from "react-redux";
import { appReady } from "./common/actions";

const lightTheme = createTheme({
  type: "light",
});

const darkTheme = createTheme({
  type: "dark",
});

const App = () => {
  const isDarkMode = useDarkMode();
  const dispatch = useDispatch();
  console.log(store.getState());

  useEffect(() => {
    dispatch(appReady());
  }, []);

  return (
    <NextUIProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Router />
    </NextUIProvider>
  );
};

export default App;
