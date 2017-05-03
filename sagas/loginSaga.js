import {
  Platform,
} from 'react-native';
import { Facebook } from 'expo';
import { fork, call, put, takeEvery } from 'redux-saga/effects';
import LocalStorage from '../utils/LocalStorage';
import ActionTypes from '../state/ActionTypes';
import { User } from '../state/Records';
import { request } from '../utils/fetch';
// import { ayupGet } from '../utils/fetch';
import { URL, POST, GET } from '../constants/rest';

export function* watchLogin() {
  yield takeEvery(ActionTypes.SIGN_IN, authorize);
}

function* authorize() {
  let fbInfo, ayUser;
  yield put({ type: ActionTypes.ALERT_SAVING });
  const fbLogin = yield call(facebookLogin);
  if (fbLogin.type === 'success') {
    try {
      fbInfo = yield call(request, GET, `https://graph.facebook.com/me?access_token=${fbLogin.token}&fields=name,id,gender,picture.width(240).height(240),email,age_range,verified`);
    } catch (error) {
      //Alert Error
      yield put({ type: ActionTypes.ALERT_ERROR, error });
      yield put({ type: ActionTypes.RESET_ALERT });
      return;
    }
    try {
      // console.log(fbInfo);
      ayUser = yield call(request, POST,  URL + "/v1.0/auth/facebook?id=" + fbInfo.body.id, {Token: fbLogin.token});
    } catch (error) {
      //Alert Error
      yield put({ type: ActionTypes.ALERT_ERROR, error });
      yield put({ type: ActionTypes.RESET_ALERT });
      return;
    }
    // console.log("this is ayuser");
    // console.log(ayUser);
    //TODO: log error message after call
    let saveUser = new User({
      'authToken': ayUser.body.authToken,
      'profilePic': fbInfo.body.picture.data.url,
      'expires': new Date(Date.now() + fbLogin.expires),
      'email': fbInfo.body.email,
      'gender': fbInfo.body.gender,
      'name': fbInfo.body.name,
      'fbid': fbInfo.body.id,
      'id': ayUser.body.id,
      'age_range': fbInfo.body.age_range.min,
      'secret': ayUser.headers.get('authorization'),
      'new': false,
    });
    console.log(fbInfo.body.age_range);
    yield fork(LocalStorage.saveUserAsync, saveUser);
    yield put({ type: ActionTypes.SET_CURRENT_USER, user: saveUser });
    yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: 'Home'});
    yield put({ type: ActionTypes.SYNC_PROFILE });
    yield put({ type: ActionTypes.RESET_ALERT });
    return;
  } else {
    //TODO: throw error message
    yield put({ type: ActionTypes.ALERT_ERROR });
    yield put({ type: ActionTypes.RESET_ALERT });
    return;
  }
}

async function facebookLogin() {
  const login = await Facebook.logInWithReadPermissionsAsync('1521840934725105', {
    permissions: ['public_profile', 'email', 'user_friends'],
    behavior: Platform.OS === 'ios' ? 'web' : 'system',
  });
  return login;
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
