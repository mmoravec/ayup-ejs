import { put, call } from 'redux-saga/effects';
import { Map, List } from 'immutable';
import ActionTypes from '../state/ActionTypes';
import LocalStorage from '../state/LocalStorage';
import { User } from '../state/Records';

export default function* startup() {
  yield [
    call(setInitialRegion),
    call(getUser),
  ];
}

function* getUser() {
  let user = yield call(LocalStorage.getUserAsync);
  if (!user.id) {
    user = {'new': true};
  }
  user = new User(user);
  yield put({ type: ActionTypes.SET_CURRENT_USER, user });
}

function* setInitialRegion() {
  let region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  yield put({ type: ActionTypes.SET_REGION, region });
}
