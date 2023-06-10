import { post } from "../api/http";
import { User } from "../user/types";
import {
  generateKeyPair,
  encrypt,
  decrypt,
  exportKey,
  aesGcmEncrypt,
  aesGcmDecrypt,
  importPrivateKey,
} from "../crypto";

export const login = async (data: { email: string; password: string }) => {
  return await post("/auth/login", data);
};

export const register = async (data: Omit<User, "id">) => {
  const keypair = await generateKeyPair();
  try {
    const text = "initial text";
    const encrypted = await encrypt(text, keypair.publicKey);
    const decrypted = await decrypt(encrypted, keypair.privateKey);
    console.log(text, encrypted, decrypted, keypair);
    const exportedKey = await exportKey(keypair.privateKey);
    console.log("exportedKey", exportedKey);
    const encryptedPrivateKey = await aesGcmEncrypt(exportedKey, "password");
    console.log("encryptedPrivateKey", encryptedPrivateKey);
    const decryptedPrivateKey = await aesGcmDecrypt(
      encryptedPrivateKey,
      "password"
    );
    console.log("decryptedPrivateKey", decryptedPrivateKey);
    const importedKey = await importPrivateKey(decryptedPrivateKey);
    console.log("importedKey", importedKey);
    const decryptedByDecrypredPrivateKey = await decrypt(
      encrypted,
      importedKey
    );
    console.log(
      "decryptedByDecrypredPrivateKey",
      decryptedByDecrypredPrivateKey
    );
  } catch (e) {
    console.log("!!!!!!", e);
  }

  return post("/auth/register", data);
};
