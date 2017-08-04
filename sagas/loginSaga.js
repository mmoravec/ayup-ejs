import qs from "qs";
import { Platform, Alert } from "react-native";
import Expo, { Facebook, Constants } from "expo";
import { fork, call, put, takeEvery, select } from "redux-saga/effects";
import ActionTypes from "../state/ActionTypes";
import { Credential } from "../state/Records";
import { request, fb } from "../utils/fetch";
// import { ayupGet } from '../utils/fetch';
import { URL, POST, GET } from "../constants/rest";

export function* watchLogin() {
  yield takeEvery(ActionTypes.SIGN_IN, authorize);
}

function* authorize() {
  let fbInfo, credential, userid = "";
  const phone = yield select(state => state.phone);
  let params = phone.params, merge = phone.accountMerged;
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
    if (params.userid) {
      userid = "&userid=" + params.userid;
    }
    try {
      // console.log(fbInfo);
      credential = yield call(
        request,
        POST,
        URL + "/v1.0/account/login/facebook?fbid=" + fbInfo.id + userid,
        null,
        { Token: fbLogin.token }
      );
    } catch (error) {
      //Alert Error
      yield put({ type: ActionTypes.ALERT_ERROR, error });
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
      age_group: fbInfo.age_range.min >= 18 ? "adult" : "kid",
    };
    Alert.alert(merge);
    if (!merge) {
      yield call(getBranch);
    }
    yield put({ type: ActionTypes.UPDATE_PROFILE, profile });
    yield put({ type: ActionTypes.RESET_ALERT });
    yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Home" });
    return;
  } else {
    //TODO: throw error message
    yield put({ type: ActionTypes.ALERT_ERROR });
    return;
  }
}

async function facebookLogin() {
  let type = Platform.OS === "android" ? "native" : "browser";
  const login = await Facebook.logInWithReadPermissionsAsync(
    "1521840934725105",
    {
      permissions: ["public_profile", "email", "user_friends"],
      behavior: Constants.appOwnership === "standalone" ? type : "web",
    }
  );
  return login;
}

function* getBranch() {
  let branch = yield call(Expo.DangerZone.Branch.getFirstReferringParams);
  Alert.alert(JSON.stringify(branch));
  if (!branch) {
    return;
  }
  let url = branch["~referring_link"], data;
  Alert.alert(JSON.stringify(url));
  if (url) {
    let queryString = url.substr(url.indexOf("?") + 1);
    if (queryString) {
      data = qs.parse(queryString);
    }
    Alert.alert(JSON.stringify(data));
    if (data.userID && data.eventID) {
      try {
        yield call(
          request,
          POST,
          URL +
            "/v1.0/events/" +
            data.eventID +
            "/accepttextinvite?userid=" +
            data.userID
        );
      } catch (error) {
        yield put({ type: ActionTypes.ALERT_ERROR, error });
        return;
      }
      yield put({
        type: ActionTypes.ACCOUNTS_MERGED,
      });
    }
  }
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
