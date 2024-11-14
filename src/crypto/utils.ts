export const pack = (buffer: BufferSource) =>
  // @ts-expect-error
  window.btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));

export const unpack = (packed: string) => {
  const string = window.atob(packed);
  const buffer = new ArrayBuffer(string.length);
  const bufferView = new Uint8Array(buffer);

  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i);
  }

  return buffer;
};

export const encode = (data: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(data);
};

export const decode = (byteStream: BufferSource) => {
  const decoder = new TextDecoder();
  return decoder.decode(byteStream);
};
