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
  let init = true;
  while (init) {
    yield take(ActionTypes.SET_CURRENT_USER);
    const user = yield select(state => state.user);
    if (user.id !== null) {
      //    yield call(initOptimizely, user);
      init = false;
    }
  }
}

function* initOptimizely(user) {
  let data;
  try {
    data = yield call(request, GET, OPTLY_URL);
  } catch (error) {
    yield call(delay, 5000);
    yield fork(initOptimizely);
    return;
  }
  let optly = Optly.createInstance({ datafile: data.body, logLevel: 5 });
  yield put({
    type: ActionTypes.OPTLY_LOADED,
    optly,
  });
  let variation = optly.activate("Alpha_v1", user.id);
  yield put({ type: ActionTypes.SET_OPTLY_VARIATION, variation });
  yield takeEvery(
    [
      ActionTypes.ROUTE_CHANGE,
      ActionTypes.SAVE_EVENT,
      ActionTypes.REQUEST_ERROR,
      ActionTypes.ACCEPT_EVENT,
      ActionTypes.JOIN_EVENT,
      ActionTypes.SET_SELECTED_EVENT,
      ActionTypes.REGION_CHANGE,
    ],
    trackEvent,
    optly,
    user
  );
}

function* trackEvent(optly, user, action) {
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
