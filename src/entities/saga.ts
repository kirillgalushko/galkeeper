import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { requestUpdateEntities, setEntities } from "./actions";
import { getAllEntities } from "./api";
import { Entities } from "./types";

function* handleUpdateEntities(): SagaIterator<void> {
  const entities: Entities = yield call(getAllEntities);
  yield put(setEntities(entities));
}

export function* entitiesSaga() {
  yield takeLatest(requestUpdateEntities, handleUpdateEntities);
}
