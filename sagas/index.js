import { fork } from 'redux-saga/effects';
import startup from './startup';
import { watchRegionChange } from './mapSaga';
import { watchLogin } from './loginSaga';
/*
 * The entry point for all the sagas used in this application.
 */
export default function* root() {
  yield [
    fork(startup),
    fork(watchRegionChange),
    fork(watchLogin),
  ];
}
