import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { clearToken, logout } from "./actions";
import { clearAllEntities } from "../entities/api";
import { requestUpdateEntities } from "../entities/actions";
import { clearUser } from "../user/actions";

function* handleLogout(): SagaIterator<void> {
  yield call(clearAllEntities);
  yield put(requestUpdateEntities());
  yield put(clearToken());
  yield put(clearUser());
}

export function* authSaga() {
  yield takeLatest(logout, handleLogout);
}
