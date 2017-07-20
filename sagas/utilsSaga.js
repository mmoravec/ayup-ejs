import { List } from "immutable";
import { delay } from "redux-saga";
import qs from "qs";
import { Image, Alert, Linking } from "react-native";
import { Constants } from "expo";
import { takeLatest, select, call, put, fork } from "redux-saga/effects";
import { getLocation } from "./startup";
import ActionTypes from "../state/ActionTypes";
import LocalStorage from "../utils/LocalStorage";
import { request } from "../utils/fetch";
import { URL, POST, GET, DELETE, PUT } from "../constants/rest";

export function* watchRequestStatus() {
  yield [
    takeLatest([ActionTypes.ALERT_ERROR, ActionTypes.ALERT_SUCCESS], setStatus),
    takeLatest(ActionTypes.HANDLE_URL, handleURL),
    takeLatest(ActionTypes.RESET_LOCATION, getLocation),
  ];
}

function* setStatus(action) {
  yield call(delay, 2000);
  yield put({ type: ActionTypes.RESET_ALERT });
}

function* handleURL(action) {
  let url = action.url, data;
  // if (Constants.intentUri) {
  //   let queryString = Constants.intentUri.substr(
  //     Constants.intentUri.indexOf("?") + 1
  //   );
  //   if (queryString) {
  //     let data = qs.parse(queryString);
  //     Alert.alert(data);
  //     yield put({ type: ActionTypes.SET_PARAMS, data });
  //   }
  // } else
  if (url) {
    let queryString = url.substr(url.indexOf("?") + 1);
    if (queryString) {
      data = qs.parse(queryString);
    }
    if (data.userid && data.eventid) {
      yield call(mergeAccountsAndRedirect, data);
    }
  }
}

function* mergeAccountsAndRedirect(data) {
  try {
    yield call(
      request,
      POST,
      URL +
        "/v1.0/events/" +
        data.eventid +
        "/accepttextinvite?userid=" +
        data.userid
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR, error });
    return;
  }
  yield put({ type: ActionTypes.LOAD_EVENT, eventID: data.eventid });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Event" });
}
