import { fork, call, put, takeEvery } from 'redux-saga/effects';
import {
  Platform,
} from 'react-native';
import { Facebook } from 'expo';
import LocalStorage from '../utils/LocalStorage';
import ActionTypes from '../state/ActionTypes';
import { User } from '../state/Records';
import { request } from '../utils/fetch';
// import { ayupGet } from '../utils/fetch';
import { URL, POST } from '../constants/rest';

export function* watchLogin() {
  yield takeEvery(ActionTypes.SIGN_IN, authorize);
}

function* authorize() {
  yield put({ type: ActionTypes.ALERT_SAVING });
  const fbLogin = yield call(facebookLogin);
  if (fbLogin.type === 'success') {
    let fbInfo = yield call(getInfo, fbLogin.token);
    //TODO: log error message after call
    let ayUser = yield call(request, POST,  URL + "/v1.0/auth/facebook?id=" + fbInfo.id, {Token: fbLogin.token});
    //TODO: log error message and alert user.
    if(ayUser.error) return;
    console.log("this is ayuser");
    console.log(ayUser);
    //TODO: log error message after call
    let saveUser = new User({
      'authToken': ayUser.body.authToken,
      'profilePic': fbInfo.picture.data.url,
      'expires': new Date(Date.now() + fbLogin.expires),
      'email': fbInfo.email,
      'gender': fbInfo.gender,
      'name': fbInfo.name,
      'fbid': fbInfo.id,
      'id': ayUser.body.id,
      'secret': ayUser.headers.get('authorization'),
      'new': false,
    });
    yield fork(LocalStorage.saveUserAsync, saveUser);
    yield put({ type: ActionTypes.SET_CURRENT_USER, user: saveUser });
    yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: 'Home' });
    yield put({ type: ActionTypes.SYNC_PROFILE });
    yield put({ type: ActionTypes.RESET_ALERT });
  } else {
    //TODO: throw error message
  }
}

function facebookLogin() {
  return Facebook.logInWithReadPermissionsAsync('1521840934725105', {
    permissions: ['public_profile', 'email', 'user_friends'],
    behavior: Platform.OS === 'ios' ? 'web' : 'system',
  });
}

async function getInfo(token) {
  let response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=name,id,gender,picture.width(240).height(240),email`);
  let info = await response.json();
  return info;
}


// async function saveUser(user) {
//   let userStr = JSON.stringify(user.toJS());
//   (userStr);
//   let response = await fetch('http://localhost:8000/auth/', {
//     method: 'post',
//     body: userStr,
//   });
// //  let info = await response.json();
//   return null;
// }
