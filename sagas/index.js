import { fork } from 'redux-saga/effects';
import startup from './startup';
import { watchLogin } from './loginSaga';
import { watchUnauthenticated, watchRouteChange } from './routeSaga';
import { refreshUserFriends, watchGetProfile, watchSyncProfile } from './userSaga';
import {
  watchEventSave,
  watchRegionChange,
  watchAcceptEvent,
  watchRequestEvent,
  watchLoadComments,
  watchSaveComment,
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
    fork(watchGetProfile),
    fork(watchSyncProfile),
    fork(watchRequestEvent),
    fork(watchAcceptEvent),
    fork(watchLoadComments),
    fork(watchSaveComment),
  ];
}
