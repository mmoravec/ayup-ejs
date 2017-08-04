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
    takeLatest(ActionTypes.RESET_LOCATION, getLocation),
  ];
}

function* setStatus(action) {
  yield call(delay, 2000);
  yield put({ type: ActionTypes.RESET_ALERT });
}
