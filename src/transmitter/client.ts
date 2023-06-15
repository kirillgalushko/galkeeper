import { io, Socket } from "socket.io-client";
import { store } from "../storage/redux";
import { requestSoftSync } from "../sync/actions";

export class TransmitterClient {
  socket: Socket;

  constructor() {
    this.socket = io("ws://localhost:3001", {
      path: "/transmitter",
      transports: ["websocket"],
      autoConnect: false,
    });

    // Default events
    this.socket.on("connect", this.onConnect);
    this.socket.on("disconnect", this.onDisconnect);
    this.socket.on("error", this.onError);

    // Custom events
    this.socket.on("request-sync", this.onRequestSync);
  }

  connect(token: string) {
    this.socket.auth = {
      token,
    };
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  onRequestSync() {
    console.log("request-sync");
    store.dispatch(requestSoftSync());
  }

  onConnect() {
    console.log("Connect");
  }

  onDisconnect(event: any) {
    console.log("onDisconnect", event);
    console.log(event);
  }

  onError(event: any) {
    console.log("onError", event);
    console.log(event);
  }

  emitSyncRequest() {
    this.socket.emit("request-sync");
  }
}

export const transmitterClient = new TransmitterClient();
