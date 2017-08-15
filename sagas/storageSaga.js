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
        ActionTypes.SET_FBFRIENDS,
        ActionTypes.SET_CONTACTS,
        ActionTypes.SET_LOCAL_NOTIFICATIONS,
      ],
      saveState
    ),
    takeLatest(
      [ActionTypes.REMOVE_ACTIVITY, ActionTypes.ADD_ACTIVITY],
      saveFiltersAsyncSaga
    ),
    takeLatest([ActionTypes.SET_CREDENTIAL], saveCredentialAsyncSaga),
  ];
}

function* saveState(action) {
  let phone = yield select(state => state.phone);
  yield call(LocalStorage.savePhoneStateAsync, phone);
}

function* saveFiltersAsyncSaga(action) {
  const filters = yield select(state => state.events.filters);
  yield call(LocalStorage.saveFiltersAsync, filters);
}

function* saveCredentialAsyncSaga(action) {
  const credential = yield select(state => state.credential);
  yield call(LocalStorage.saveCredentialAsync, credential);
}
