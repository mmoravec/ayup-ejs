import { fork } from 'redux-saga/effects';
import startup from './startup';
import { watchLogin } from './loginSaga';
import { watchUnauthenticated, watchRouteChange } from './routeSaga';
import { refreshUserFriends, watchSyncProfile } from './userSaga';
import { watchInitAnalytics } from './analyticsSaga';
import { watchEventAction } from './eventSaga';
import { watchFormActions } from './formSaga';
import { watchGettingStarted } from './gettingStartedSaga';
/*
 * The entry point for all the sagas used in this application.
 */
export default function* root() {
  yield [
    fork(startup),
    fork(watchEventAction),
    fork(watchLogin),
    fork(watchRouteChange),
    fork(refreshUserFriends),
    fork(watchUnauthenticated),
    fork(watchSyncProfile),
    fork(watchInitAnalytics),
    fork(watchFormActions),
    fork(watchGettingStarted),
  ];
}
