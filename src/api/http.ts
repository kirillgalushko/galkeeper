import { FetchError } from "./FetchError";
import { store } from "../storage/redux";
import { logout } from "../auth/actions";

const getHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${store.getState().auth}`,
});
const API_URL = "http://localhost:3001";

const handleResponse = async (rawResponse: Response) => {
  if (rawResponse.ok) {
    return rawResponse.json();
  }
  const body = await rawResponse?.json?.();

  if (rawResponse.status === 401) {
    store.dispatch(logout());
  }

  throw new FetchError(rawResponse.status, body.message, rawResponse);
};

export const get = async (endpoint: string, params?: Record<string, any>) => {
  const rawResponse = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
    body: params ? JSON.stringify(params) : undefined,
  });
  return handleResponse(rawResponse);
};

export const post = async (endpoint: string, params?: Record<string, any>) => {
  const rawResponse = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: params ? JSON.stringify(params) : undefined,
  });
  return handleResponse(rawResponse);
};
