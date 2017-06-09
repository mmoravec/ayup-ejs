import { List } from "immutable";
import { delay } from "redux-saga";
import { takeLatest, select, call, put, fork } from "redux-saga/effects";
import ActionTypes from "../state/ActionTypes";
import LocalStorage from "../utils/LocalStorage";
import { request } from "../utils/fetch";
import { URL, POST, GET, DELETE } from "../constants/rest";

export function* watchRequestStatus() {
  yield takeLatest(
    [ActionTypes.ALERT_ERROR, ActionTypes.ALERT_SUCCESS],
    setStatus
  );
}

function* setStatus(action) {
  yield call(delay, 2000);
  yield put({ type: ActionTypes.RESET_ALERT });
}
