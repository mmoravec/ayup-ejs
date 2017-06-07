import { List } from "immutable";
import { delay } from "redux-saga";
import { takeLatest, select, call, put, fork } from "redux-saga/effects";
import ActionTypes from "../state/ActionTypes";
import LocalStorage from "../utils/LocalStorage";
import { request } from "../utils/fetch";
import { URL, POST, GET, DELETE } from "../constants/rest";

export function* watchStorageActions() {
  yield [
    takeLatest(
      [
        ActionTypes.LOCATION_GRANTED,
        ActionTypes.CONTACTS_GRANTED,
        ActionTypes.NOTIFICATIONS_GRANTED,
      ],
      saveState
    ),
    takeLatest(
      [ActionTypes.REMOVE_ACTIVITY, ActionTypes.ADD_ACTIVITY],
      saveFiltersAsyncSaga
    ),
  ];
}

function* saveState(action) {
  let user = yield select(state => state.user);
  let phone = yield select(state => state.phone);
  yield call(LocalStorage.saveUserAsync, user);
  yield call(LocalStorage.savePhoneStateAsync, phone);
}

function* saveFiltersAsyncSaga(action) {
  yield call(delay, 2000);
  const filters = yield select(state => state.events.filters);
  yield call(LocalStorage.saveFiltersAsync, filters);
}
