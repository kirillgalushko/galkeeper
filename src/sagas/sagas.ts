import { all } from "redux-saga/effects";
import { entitiesSaga } from "../entities/saga";
import { syncSaga } from "../sync/saga";
import { authSaga } from "../auth/sagas";

export function* rootSaga() {
  yield all([entitiesSaga(), syncSaga(), authSaga()]);
}
