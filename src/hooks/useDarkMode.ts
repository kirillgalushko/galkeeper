import { useState, useEffect } from "react";

export const useDarkMode = () => {
  const [isDarkMode, setDarkMode] = useState<boolean>(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const updateMode = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", updateMode);
    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", updateMode);
  }, []);

  return isDarkMode;
};
