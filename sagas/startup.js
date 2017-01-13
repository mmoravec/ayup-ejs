import { put } from 'redux-saga/effects';

export default function* startup() {
  console.log('startup working');
  // yield put(fetchVaccinations());
}
