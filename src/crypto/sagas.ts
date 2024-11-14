import { takeLatest, all, call } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { afterLogin, logout } from "../auth/actions";
import { keyManager } from "./keyManager";

function* handleLogout(): SagaIterator<void> {
  keyManager.resetKeys();
}

function* handleAfterLogin(
  action: ReturnType<typeof afterLogin>
): SagaIterator<void> {
  try {
    const keys: Awaited<ReturnType<typeof keyManager.generateKeyPair>> =
      yield call(() => keyManager.generateKeyPair());
    yield call(() => keyManager.saveKeys(keys));
  } catch (e) {
    console.log(e);
  }
}

export function* cryptoSaga() {
  yield all([
    takeLatest(logout, handleLogout),
    takeLatest(afterLogin, handleAfterLogin),
  ]);
}
