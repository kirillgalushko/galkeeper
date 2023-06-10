import { spawn, select, delay } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { isAuthorizedSelector } from "../auth/selectors";

const minute = 10000;

function* continuouslySyncEntities(): SagaIterator<void> {
  while (true) {
    const isAuthorized = isAuthorizedSelector(yield select());

    if (isAuthorized) {
      try {
        // TODO: Add sync logic
      } catch (e) {
        // Ignore, keep trying
      }
    }

    yield delay(minute);
  }
}

export function* syncSaga() {
  yield spawn(continuouslySyncEntities);
}
