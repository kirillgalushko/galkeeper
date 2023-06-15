import { call, put, takeLatest, all } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { requestUpdateEntities, setEntities } from "./actions";
import { getAllEntities } from "./api";
import { Entities } from "./types";
import { appReady } from "../common/actions";

function* handleUpdateEntities(): SagaIterator<void> {
  const entities: Entities = yield call(getAllEntities);
  yield put(setEntities(entities));
}

export function* entitiesSaga() {
  yield all([
    takeLatest(appReady, handleUpdateEntities),
    takeLatest(requestUpdateEntities, handleUpdateEntities),
  ]);
}
