import { spawn, all, takeLatest, select } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { transmitterClient } from "./client";
import { syncSuccess } from "../sync/actions";
import { logout, setToken } from "../auth/actions";
import { appReady } from "../common/actions";
import { authTokenSelector } from "../auth/selectors";

function* subscribeToTransmitter(): SagaIterator<void> {
  const authToken = yield select(authTokenSelector);
  if (!authToken) {
    return;
  }
  transmitterClient.connect(authToken);
}

function* requestSyncOnOtherClients(): SagaIterator<void> {
  transmitterClient.emitSyncRequest();
}

function* disconnectTransmitter(): SagaIterator<void> {
  transmitterClient.disconnect();
}

export function* transmitterSaga() {
  yield all([
    takeLatest(appReady, subscribeToTransmitter),
    takeLatest(setToken, subscribeToTransmitter),
    takeLatest(syncSuccess, requestSyncOnOtherClients),
    takeLatest(logout, disconnectTransmitter),
  ]);
}
