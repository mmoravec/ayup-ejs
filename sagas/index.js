import { fork } from 'redux-saga/effects';
import startup from './startup';
import { watchLogin } from './loginSaga';
import { watchUnauthenticated, watchRouteChange } from './routeSaga';
import { refreshUserFriends, watchSyncProfile } from './userSaga';
import { watchInitOptimizely } from './analyticsSaga';
import {
  watchEventSave,
  watchRegionChange,
  watchAcceptEvent,
  watchRequestEvent,
  watchLoadComments,
  watchSaveComment,
  watchLoadEvent,
} from './eventSaga';
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
    fork(watchSyncProfile),
    fork(watchRequestEvent),
    fork(watchAcceptEvent),
    fork(watchLoadComments),
    fork(watchSaveComment),
    fork(watchLoadEvent),
    fork(watchInitOptimizely),
  ];
}
