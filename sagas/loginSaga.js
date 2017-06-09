import { Platform } from "react-native";
import { Facebook } from "expo";
import { fork, call, put, takeEvery } from "redux-saga/effects";
import ActionTypes from "../state/ActionTypes";
import { Credential } from "../state/Records";
import { request, fb } from "../utils/fetch";
// import { ayupGet } from '../utils/fetch';
import { URL, POST, GET } from "../constants/rest";

export function* watchLogin() {
  yield takeEvery(ActionTypes.SIGN_IN, authorize);
}

function* authorize() {
  let fbInfo, credential;
  yield put({ type: ActionTypes.ALERT_SAVING });
  const fbLogin = yield call(facebookLogin);
  if (fbLogin.type === "success") {
    try {
      fbInfo = yield call(fb, fbLogin);
    } catch (error) {
      //Alert Error
      yield put({ type: ActionTypes.ALERT_ERROR, error });
      return;
    }
    try {
      // console.log(fbInfo);
      credential = yield call(
        request,
        POST,
        URL + "/v1.0/account/login/facebook?fbid=" + fbInfo.id,
        null,
        { Token: fbLogin.token }
      );
    } catch (error) {
      //Alert Error
      yield put({ type: ActionTypes.ALERT_ERROR, error });
      console.log(error);
      return;
    }
    //TODO: log error message after call
    yield put({
      type: ActionTypes.SET_CREDENTIAL,
      credential: credential.body,
    });
    let profile = {
      profile_pic: fbInfo.picture.data.url,
      name: fbInfo.name,
      email: fbInfo.email,
      gender: fbInfo.gender,
    };
    yield put({ type: ActionTypes.UPDATE_PROFILE, profile });
    yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Home" });
    return;
  } else {
    //TODO: throw error message
    yield put({ type: ActionTypes.ALERT_ERROR });
    return;
  }
}

async function facebookLogin() {
  const login = await Facebook.logInWithReadPermissionsAsync(
    "1521840934725105",
    {
      permissions: ["public_profile", "email", "user_friends"],
      behavior: Platform.OS === "ios" ? "web" : "system",
    }
  );
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
