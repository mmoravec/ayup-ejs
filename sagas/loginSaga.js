import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  Platform,
} from 'react-native';
import { Facebook } from 'exponent';
import LocalStorage from '../state/LocalStorage';
import ActionTypes from '../state/ActionTypes';
import { User } from '../state/Records';
import sampledata from '../constants/user';

function facebookLogin() {
  return Facebook.logInWithReadPermissionsAsync('1521840934725105', {
    permissions: ['public_profile', 'email', 'user_friends'],
    behavior: Platform.OS === 'ios' ? 'web' : 'system',
  });
}

async function getInfo(token) {
  console.log("fb access token: " + token);
  let response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=name,id,gender,picture.width(240).height(240),email`);
  let info = await response.json();
  return info;
}

function* authorize() {
  let user = null;
  const result = yield call(facebookLogin);
  if (result.type === 'success') {
    user = yield call(getInfo, result.token);
  }
  console.log('fb user info: ' + JSON.stringify(user));
  user = new User({
    'authToken': result.token,
    'profilePic': user.picture.data.url,
    ...user,
    ...sampledata,
  });
  console.log(user);
  // let resp = yield call(saveUser, user);
  //add secret to the user object and authenticate all calls
  LocalStorage.saveUserAsync(user);
  yield put({ type: ActionTypes.SET_CURRENT_USER, user });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: 'home' });
}

export function* watchLogin() {
  yield takeEvery(ActionTypes.SIGN_IN, authorize);
}


async function saveUser(user) {
  let userStr = JSON.stringify(user.toJS());
  console.log(userStr);
  let response = await fetch('http://localhost:8000/auth/', {
    method: 'post',
    body: userStr,
  });
//  let info = await response.json();
  return null;
}
