import { take, call, put, select, takeEvery, fork } from "redux-saga/effects";
import Expo from "expo";
import { delay } from "redux-saga";
import { Platform } from "react-native";
import Optly from "optimizely-client-sdk";
import ActionTypes from "../state/ActionTypes";
import { request } from "../utils/fetch";
import { GET, OPTLY_URL } from "../constants/rest";
//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchInitAnalytics() {
  yield take(ActionTypes.SET_CREDENTIAL);
  const cred = yield select(state => state.credential);
  // if (cred.id !== null) {
  //   //    yield call(initOptimizely, user);
  //   init = false;
  // }
  yield call(initAmplitude, cred);
}

// function* initOptimizely(user) {
//   let data;
//   try {
//     data = yield call(request, GET, OPTLY_URL);
//   } catch (error) {
//     yield call(delay, 5000);
//     yield fork(initOptimizely);
//     return;
//   }
//   let optly = Optly.createInstance({ datafile: data.body, logLevel: 5 });
//   yield put({
//     type: ActionTypes.OPTLY_LOADED,
//     optly,
//   });
//   let variation = optly.activate("Alpha_v1", user.id);
//   yield put({ type: ActionTypes.SET_OPTLY_VARIATION, variation });
//   yield takeEvery(
//     [
//       ActionTypes.ROUTE_CHANGE,
//       ActionTypes.SAVE_EVENT,
//       ActionTypes.REQUEST_ERROR,
//       ActionTypes.ACCEPT_EVENT,
//       ActionTypes.JOIN_EVENT,
//       ActionTypes.SET_SELECTED_EVENT,
//       ActionTypes.REGION_CHANGE,
//     ],
//     trackEvent,
//     optly,
//     user
//   );
// }

function* trackOptlyEvent(optly, user, action) {
  let attr = {
    platform: Platform.OS,
    version: Platform.Version,
    gender: user.gender,
    route: action.newRoute,
    expo: Expo.Constants.expoVersion,
  };
  if (Platform.OS === "ios") {
    attr.model = Expo.Constants.platform.ios.model;
  }
  optly.track(action.type, user.id, attr);
}

function* initAmplitude(user) {
  Expo.Amplitude.initialize("b9b1b7bf1862786ce6473322dff27d1b");
  Expo.Amplitude.setUserId(user.user_id);
  yield takeEvery([ActionTypes.SAVE_EVENT], trackAmplitudeEvent);
}

function* trackAmplitudeEvent(action) {
  console.log("tracking ampy event");
  Expo.Amplitude.logEvent(action.type);
}
