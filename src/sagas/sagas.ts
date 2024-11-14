import { all } from "redux-saga/effects";
import { entitiesSaga } from "../entities/saga";
import { syncSaga } from "../sync/saga";
import { authSaga } from "../auth/sagas";
import { transmitterSaga } from "../transmitter/saga";
import { cryptoSaga } from "../crypto/sagas";

export function* rootSaga() {
  yield all([
    entitiesSaga(),
    syncSaga(),
    authSaga(),
    transmitterSaga(),
    cryptoSaga(),
  ]);
}
