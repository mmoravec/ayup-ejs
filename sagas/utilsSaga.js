import { List } from "immutable";
import { delay } from "redux-saga";
import qs from "qs";
import { Image, Alert, Linking } from "react-native";
import { Constants } from "expo";
import { takeLatest, select, call, put, take, fork } from "redux-saga/effects";
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
  let data = {}, url = action.url;
  if (url.eventID) {
    data.eventid = url.eventID;
    data.userid = url.userID;
  }
  if (data.userid && data.eventid) {
    yield call(mergeAccountsAndRedirect, data);
  } else if (data.eventid) {
    yield call(directToEvent, data);
  }
}

function* mergeAccountsAndRedirect(data) {
  const cred = yield select(state => state.credential);
  if (!cred.secret && !cred.user_id) {
    yield take(ActionTypes.SET_CREDENTIAL);
  }
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

function* directToEvent(data) {
  const cred = yield select(state => state.credential);
  if (!cred.secret && !cred.user_id) {
    yield take(ActionTypes.SET_CREDENTIAL);
  }
  yield put({ type: ActionTypes.LOAD_EVENT, eventID: data.eventid });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Event" });
}
