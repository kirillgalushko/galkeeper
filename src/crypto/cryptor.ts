import { keyManager } from "./keyManager";
import { encode, decode, pack, unpack } from "./utils";

class Cryptor {
  async encrypt(plaintext: string) {
    const { publicKey } = await keyManager.getKeys();
    const encoded = encode(plaintext);
    const cipher = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      encoded
    );

    return pack(cipher);
  }

  async decrypt(cipher: string) {
    const { privateKey } = await keyManager.getKeys();
    const encoded = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      unpack(cipher)
    );

    return decode(encoded);
  }
}

export const cryptor = new Cryptor();
