import { call, put, takeLatest, all } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { afterLogin, clearToken, logout, setToken } from "./actions";
import { clearAllEntities } from "../entities/api";
import { requestUpdateEntities } from "../entities/actions";
import { clearUser, setUser } from "../user/actions";

function* handleLogout(): SagaIterator<void> {
  yield call(clearAllEntities);
  yield put(requestUpdateEntities());
  yield put(clearToken());
  yield put(clearUser());
}

function* handleAfterLogin(
  action: ReturnType<typeof afterLogin>
): SagaIterator<void> {
  const { user, token } = action.payload;
  yield put(setToken(token));
  // TODO: Move to user saga
  yield put(setUser(user));
}

export function* authSaga() {
  yield all([
    takeLatest(logout, handleLogout),
    takeLatest(afterLogin, handleAfterLogin),
  ]);
}
