import { keysStore } from "./keysStore";
import { pack, unpack } from "./utils";

const { subtle } = globalThis.crypto;
const publicExponent = new Uint8Array([1, 0, 1]);
const modulusLength = 2048;
const hash = "SHA-256";

const keysUsage = {
  public: "encrypt",
  private: "decrypt",
} as const;
const keysFormat = {
  public: "spki",
  private: "pkcs8",
} as const;

type KeyType = "public" | "private";

class KeyManager {
  async getKeys() {
    const encryptedKeys = keysStore.getKeys();
    const decryptedPublicKey = await this.decryptKey(
      encryptedKeys.publicKey,
      "password"
    );
    const decryptedPrivateKey = await this.decryptKey(
      encryptedKeys.privateKey,
      "password"
    );
    const importedPublicKey = await this.importKey(
      decryptedPublicKey,
      "public"
    );
    const importedPrivateKey = await this.importKey(
      decryptedPrivateKey,
      "private"
    );
    return { publicKey: importedPublicKey, privateKey: importedPrivateKey };
  }

  async saveKeys(keys: { publicKey: CryptoKey; privateKey: CryptoKey }) {
    const exportedPublicKey = await this.exportKey(keys.publicKey, "public");
    const exportedPrivateKey = await this.exportKey(keys.privateKey, "private");
    const encryptedPublicKey = await this.encryptKey(
      exportedPublicKey,
      "password"
    );
    const encryptedPrivateKey = await this.encryptKey(
      exportedPrivateKey,
      "password"
    );
    return keysStore.setKeys({
      publicKey: encryptedPublicKey,
      privateKey: encryptedPrivateKey,
    });
  }

  async resetKeys() {
    return keysStore.setKeys(null);
  }

  async generateKeyPair() {
    const { publicKey, privateKey } = await subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength,
        publicExponent,
        hash,
      },
      true,
      ["encrypt", "decrypt"]
    );

    return { publicKey, privateKey };
  }

  async exportKey(key: CryptoKey, type: KeyType) {
    return pack(await subtle.exportKey(keysFormat[type], key));
  }

  async importKey(key: string, type: KeyType) {
    return subtle.importKey(
      keysFormat[type],
      unpack(key),
      {
        name: "RSA-OAEP",
        hash,
      },
      true,
      [keysUsage[type]]
    );
  }

  async encryptKey(keyToEncrypt: string, password: string) {
    const pwUtf8 = new TextEncoder().encode(password);
    const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ivStr = Array.from(iv)
      .map((b) => String.fromCharCode(b))
      .join("");
    const alg = { name: "AES-GCM", iv: iv };
    const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
      "encrypt",
    ]);
    const ptUint8 = new TextEncoder().encode(keyToEncrypt);
    const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8);
    const ctArray = Array.from(new Uint8Array(ctBuffer));
    const ctStr = ctArray.map((byte) => String.fromCharCode(byte)).join("");
    return btoa(ivStr + ctStr);
  }

  async decryptKey(keyToDecrypt: string, password: string) {
    const pwUtf8 = new TextEncoder().encode(password);
    const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);
    const ivStr = atob(keyToDecrypt).slice(0, 12);
    const iv = new Uint8Array(Array.from(ivStr).map((ch) => ch.charCodeAt(0)));
    const alg = { name: "AES-GCM", iv: iv };
    const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
      "decrypt",
    ]);
    const ctStr = atob(keyToDecrypt).slice(12);
    const ctUint8 = new Uint8Array(
      Array.from(ctStr).map((ch) => ch.charCodeAt(0))
    );
    try {
      const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8);
      const plaintext = new TextDecoder().decode(plainBuffer);
      return plaintext;
    } catch (e) {
      throw new Error("Decrypt failed");
    }
  }
}

export const keyManager = new KeyManager();
