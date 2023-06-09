import { FetchError } from "./FetchError";

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
const API_URL = "http://localhost:3001";

const handleResponse = async (rawResponse: Response) => {
  if (rawResponse.ok) {
    return rawResponse.json();
  }
  const body = await rawResponse?.json?.();
  throw new FetchError(rawResponse.status, body.message, rawResponse);
};

export const get = async (endpoint: string, params: any) => {
  const rawResponse = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: HEADERS,
    body: JSON.stringify(params),
  });
  return handleResponse(rawResponse);
};

export const post = async (endpoint: string, params: Record<string, any>) => {
  const rawResponse = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(params),
  });
  return handleResponse(rawResponse);
};
