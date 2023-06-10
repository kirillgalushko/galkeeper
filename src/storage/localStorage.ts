const getItem = (key: string) => localStorage.getItem(key);
const getJsonItem = (key: string) => JSON.parse(getItem(key) || "null");
const setItem = (key: string, value: string) =>
  localStorage.setItem(key, value);
const setJsonItem = (key: string, value: any) =>
  setItem(key, JSON.stringify(value));
const removeItem = (key: string) => localStorage.removeItem(key);
