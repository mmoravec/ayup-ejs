import { fork } from 'redux-saga/effects';
import startup from './startup';
import { watchLogin } from './loginSaga';
import { watchUnauthenticated, watchRouteChange } from './routeSaga';
import { refreshUserFriends } from './userSaga';
import { watchEventSave, watchRegionChange } from './eventSaga';
/*
 * The entry point for all the sagas used in this application.
 */
export default function* root() {
  yield [
    fork(startup),
    fork(watchRegionChange),
    fork(watchLogin),
    fork(watchRouteChange),
    fork(refreshUserFriends),
    fork(watchUnauthenticated),
    fork(watchEventSave),
  ];
}
