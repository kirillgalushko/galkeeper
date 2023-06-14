import {
  spawn,
  select,
  delay,
  call,
  put,
  takeLatest,
  all,
} from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { isAuthorizedSelector } from "../auth/selectors";
import { sync } from "./api";
import { requestUpdateEntities } from "../entities/actions";
import { setSyncDate, requestSync } from "./actions";
import { syncedAtSelector } from "./selectors";

const timeout = 5000;

function* continuouslySyncEntities(): SagaIterator<void> {
  while (true) {
    yield call(handleSync);
    yield delay(timeout);
  }
}

function* handleSync(): SagaIterator<void> {
  const isAuthorized = isAuthorizedSelector(yield select());
  const lastSyncedAt = syncedAtSelector(yield select()) ?? undefined;

  if (isAuthorized) {
    try {
      const syncedAt: Date = yield call(() => sync(lastSyncedAt));
      yield put(setSyncDate(syncedAt));
      yield put(requestUpdateEntities());
    } catch (e) {
      // Ignore
    }
  }
}

export function* syncSaga() {
  yield all([
    takeLatest(requestSync, handleSync),
    spawn(continuouslySyncEntities),
  ]);
}
