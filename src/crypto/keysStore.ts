const credentialsKey = "credentials";

class KeysStore {
  getKeys() {
    return JSON.parse(localStorage.getItem(credentialsKey) || "null");
  }

  setKeys(keys: any) {
    return localStorage.setItem(credentialsKey, JSON.stringify(keys));
  }
}

export const keysStore = new KeysStore();
