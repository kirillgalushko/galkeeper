import { select, call, put, takeLatest, all } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { isAuthorizedSelector } from "../auth/selectors";
import { sync } from "./api";
import { requestUpdateEntities } from "../entities/actions";
import {
  setSyncDate,
  requestSync,
  syncSuccess,
  requestSoftSync,
  clearSyncDate,
} from "./actions";
import { syncedAtSelector } from "./selectors";
import { logout, setToken } from "../auth/actions";
import { appReady } from "../common/actions";
import { Action } from "redux";

function* handleSync(
  _action: Action,
  skipSuccess?: boolean
): SagaIterator<void> {
  const isAuthorized = isAuthorizedSelector(yield select());
  const lastSyncedAt = syncedAtSelector(yield select()) ?? undefined;

  if (isAuthorized) {
    try {
      const syncedAt: Date = yield call(() => sync(lastSyncedAt));
      yield put(setSyncDate(syncedAt));
      yield put(requestUpdateEntities());
      if (!skipSuccess) {
        yield put(syncSuccess());
      }
    } catch (e) {
      // Ignore
    }
  }
}

function* handleLogout(): SagaIterator<void> {
  yield put(clearSyncDate());
}

export function* syncSaga() {
  yield all([
    takeLatest(requestSync, handleSync),
    takeLatest(requestSoftSync, (action) => handleSync(action, true)),
    takeLatest(appReady, handleSync),
    takeLatest(setToken, handleSync),
    takeLatest(logout, handleLogout),
  ]);
}
