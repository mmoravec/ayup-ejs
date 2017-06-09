import { fork } from "redux-saga/effects";
import startup from "./startup";
import { watchLogin } from "./loginSaga";
import { watchUnauthenticated, watchRouteChange } from "./routeSaga";
import { watchInitAnalytics } from "./analyticsSaga";
import { watchEventAction } from "./eventSaga";
import { watchFormActions } from "./formSaga";
import { watchGettingStarted } from "./gettingStartedSaga";
import { watchStorageActions } from "./storageSaga";
import { watchRequestStatus } from "./utilsSaga";
import { watchProfile } from "./profileSaga";
/*
 * The entry point for all the sagas used in this application.
 */
export default function* root() {
  yield [
    fork(startup),
    fork(watchEventAction),
    fork(watchLogin),
    fork(watchRouteChange),
    fork(watchUnauthenticated),
    fork(watchInitAnalytics),
    fork(watchFormActions),
    fork(watchGettingStarted),
    fork(watchStorageActions),
    fork(watchRequestStatus),
    fork(watchProfile),
  ];
}
