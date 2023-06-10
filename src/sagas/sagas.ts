import { all } from "redux-saga/effects";
import { entitiesSaga } from "../entities/saga";

export function* rootSaga() {
  yield all([entitiesSaga()]);
}
