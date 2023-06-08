import type { Options } from "electron-dl";

declare global {
  interface Window {
    ipcRender: {
      send: (channel: string, args: any) => void;
      receive: (
        channel: string,
        callback: (...args: Array<unknown>) => void
      ) => void;
    };
  }
}

export const download = (
  url: string,
  options: Options & { newFolder?: string }
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      window.ipcRender.receive("completed", (completedUrl) => {
        if (completedUrl === url) {
          resolve();
        }
      });
      window.ipcRender.send("download", { url, options });
    } catch (e) {
      reject("Bridge is broken!");
    }
  });
};
