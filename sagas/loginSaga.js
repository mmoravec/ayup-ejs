import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  Platform,
} from 'react-native';
import { Facebook } from 'exponent';
import LocalStorage from '../state/LocalStorage';
import ActionTypes from '../state/ActionTypes';
import { User } from '../state/Records';

function facebookLogin() {
  return Facebook.logInWithReadPermissionsAsync('1521840934725105', {
    permissions: ['public_profile', 'email', 'user_friends'],
    behavior: Platform.OS === 'ios' ? 'web' : 'system',
  });
}

async function getInfo(token) {
  let response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
  let info = await response.json();
  return info;
}

function* authorize() {
  let user = null;
  const result = yield call(facebookLogin);
  if (result.type === 'success') {
    user = yield call(getInfo, result.token);
  }
  user = new User({'authToken': result.token, ...user});
  LocalStorage.saveUserAsync(user);
  yield put({ type: ActionTypes.SET_CURRENT_USER, user });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: 'home' });
}

export function* watchLogin() {
  yield takeEvery(ActionTypes.SIGN_IN, authorize);
}
