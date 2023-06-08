const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
const API_URL = "http://localhost:3001";

export class HttpClient {
  url: string;

  constructor() {
    this.url = API_URL;
  }

  async get(endpoint: string, params: any) {
    const rawResponse = await fetch(`${this.url}${endpoint}`, {
      method: "GET",
      headers: HEADERS,
      body: JSON.stringify(params),
    });
    return rawResponse.json();
  }

  async post(endpoint: string, params: Record<string, any>) {
    const rawResponse = await fetch(`${this.url}${endpoint}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(params),
    });
    return rawResponse.json();
  }
}
