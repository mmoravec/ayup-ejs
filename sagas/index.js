import { fork } from 'redux-saga/effects';
import startup from './startup';
import { watchRegionChange } from './mapSaga';
import { watchLogin } from './loginSaga';
import { watchRouteChange } from './routeSaga';
import { refreshUserFriends } from './userSaga';
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
  ];
}
