import { delay } from 'redux-saga'
import { call, put, takeEvery, select } from 'redux-saga/effects';
import {
  Platform,
} from 'react-native';
import { Facebook } from 'expo';
import LocalStorage from '../state/LocalStorage';
import ActionTypes from '../state/ActionTypes';
import { User } from '../state/Records';
import sampledata from '../sample/user';
import { ayupLogin } from '../utils/fetch';
// import { ayupGet } from '../utils/fetch';
import { URL } from '../constants/rest';

export function* watchLogin() {
  yield takeEvery(ActionTypes.SIGN_IN, authorize);
}

function* authorize() {
  const fbLogin = yield call(facebookLogin);
  if (fbLogin.type === 'success') {
    let fbInfo = yield call(getInfo, fbLogin.token);
    //TODO: log error message after call
    console.log('fbInfo: ' + JSON.stringify(fbInfo));
    let ayUser = yield call(ayupLogin, URL + "/v1.0/auth/facebook/?id=" + fbInfo.id, fbLogin.token);
    //TODO: log error message after call
    let saveUser = new User({
      'authToken': ayUser.authToken,
      'profilePic': fbInfo.picture.data.url,
      'expires': new Date(Date.now() + fbLogin.expires),
      'email': fbInfo.email,
      'gender': fbInfo.gender,
      'name': fbInfo.name,
      'fbid': fbLogin.id,
      'id': ayUser.id,
      'secret': ayUser.secret,
    });
    LocalStorage.saveUserAsync(saveUser);
    yield put({ type: ActionTypes.SET_CURRENT_USER, user: saveUser });
    yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: 'Home' });
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
  console.log("fb access token: " + token);
  let response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=name,id,gender,picture.width(240).height(240),email`);
  let info = await response.json();
  return info;
}


// async function saveUser(user) {
//   let userStr = JSON.stringify(user.toJS());
//   console.log(userStr);
//   let response = await fetch('http://localhost:8000/auth/', {
//     method: 'post',
//     body: userStr,
//   });
// //  let info = await response.json();
//   return null;
// }
