const { subtle } = globalThis.crypto;
const publicExponent = new Uint8Array([1, 0, 1]);
const modulusLength = 2048;
const hash = "SHA-256";

export async function generateKeyPair() {
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

const encode = (data: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(data);
};

const decode = (byteStream: BufferSource) => {
  const decoder = new TextDecoder();
  return decoder.decode(byteStream);
};

const pack = (buffer: BufferSource) =>
  // @ts-expect-error
  window.btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));

const unpack = (packed: string) => {
  const string = window.atob(packed);
  const buffer = new ArrayBuffer(string.length);
  const bufferView = new Uint8Array(buffer);

  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i);
  }

  return buffer;
};

export const encrypt = async (data: string, publicKey: CryptoKey) => {
  const encoded = encode(data);
  const cipher = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    encoded
  );

  return cipher;
};

export const decrypt = async (cipher: BufferSource, privateKey: CryptoKey) => {
  const encoded = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    cipher
  );

  return decode(encoded);
};

export async function aesGcmEncrypt(plaintext: string, password: string) {
  const pwUtf8 = new TextEncoder().encode(password); // encode password as UTF-8
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8); // hash the password

  const iv = crypto.getRandomValues(new Uint8Array(12)); // get 96-bit random iv
  const ivStr = Array.from(iv)
    .map((b) => String.fromCharCode(b))
    .join(""); // iv as utf-8 string

  const alg = { name: "AES-GCM", iv: iv }; // specify algorithm to use

  const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
    "encrypt",
  ]); // generate key from pw

  const ptUint8 = new TextEncoder().encode(plaintext); // encode plaintext as UTF-8
  const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8); // encrypt plaintext using key

  const ctArray = Array.from(new Uint8Array(ctBuffer)); // ciphertext as byte array
  const ctStr = ctArray.map((byte) => String.fromCharCode(byte)).join(""); // ciphertext as string

  return btoa(ivStr + ctStr); // iv+ciphertext base64-encoded
}

export async function aesGcmDecrypt(ciphertext: string, password: string) {
  const pwUtf8 = new TextEncoder().encode(password); // encode password as UTF-8
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8); // hash the password

  const ivStr = atob(ciphertext).slice(0, 12); // decode base64 iv
  const iv = new Uint8Array(Array.from(ivStr).map((ch) => ch.charCodeAt(0))); // iv as Uint8Array

  const alg = { name: "AES-GCM", iv: iv }; // specify algorithm to use

  const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
    "decrypt",
  ]); // generate key from pw

  const ctStr = atob(ciphertext).slice(12); // decode base64 ciphertext
  const ctUint8 = new Uint8Array(
    Array.from(ctStr).map((ch) => ch.charCodeAt(0))
  ); // ciphertext as Uint8Array
  // note: why doesn't ctUint8 = new TextEncoder().encode(ctStr) work?

  try {
    const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8); // decrypt ciphertext using key
    const plaintext = new TextDecoder().decode(plainBuffer); // plaintext from ArrayBuffer
    return plaintext; // return the plaintext
  } catch (e) {
    throw new Error("Decrypt failed");
  }
}

export const exportKey = async (key: CryptoKey) => {
  return pack(await subtle.exportKey("pkcs8", key));
};

export const importPrivateKey = async (key: string) => {
  return subtle.importKey(
    "pkcs8",
    unpack(key),
    {
      name: "RSA-OAEP",
      hash,
    },
    true,
    ["decrypt"]
  );
};
