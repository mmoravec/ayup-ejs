import { fork } from 'redux-saga/effects';
import startup from './startup';

/*
 * The entry point for all the sagas used in this application.
 */
export default function* root() {
  yield [
    fork(startup),
  ];
}
