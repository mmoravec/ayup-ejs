import Immutable, { List } from 'immutable';
import {call, put, fork, take, select, takeLatest} from 'redux-saga/effects';
import { Contacts, Permissions, Notifications } from 'expo';
import {delay} from 'redux-saga';
import { getLocation, getContacts } from './startup';
import LocalStorage from '../utils/LocalStorage';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { User } from '../state/Records';
import { URL, PUT, GET } from '../constants/rest';

export function* watchGettingStarted() {
  yield take(ActionTypes.MERGE_PHONESTATE);
  yield call(getStarted);
}

function* getStarted() {
  const phone = yield select(state => state.phone);
  if (!phone.locationGranted) {
    yield fork(grantLocation);
  }
  if (!phone.contactsGranted) {
    yield fork(grantContacts);
  }
  if (!phone.notificationGranted) {
    yield fork(grantNotifications);
  }
}

function* grantLocation() {
  yield take(ActionTypes.GRANT_LOCATION);
  console.log('grant location working');
  let grant = yield call(getLocation);
  if (grant) {
    yield put({type: ActionTypes.LOCATION_GRANTED});
    let phone = yield select(state => state.phone);
    yield call(LocalStorage.savePhoneStateAsync, phone);
  }
}

function* grantContacts() {
  yield take(ActionTypes.INVITE_FRIENDS);
  console.log('inviting friends');
  let grant = yield call(getContacts);
  if (grant) {
    yield put({type: ActionTypes.CONTACTS_GRANTED});
    let user = yield select(state => state.user);
    let phone = yield select(state => state.phone);
    yield call(LocalStorage.saveUserAsync, user);
    yield call(LocalStorage.savePhoneStateAsync, phone);
  }
}

function* grantNotifications() {
  yield take([
    ActionTypes.SAVE_EVENT,
    ActionTypes.JOIN_EVENT,
  ]);
  //show notification dialog to user
  let { status } = yield call(Permissions.askAsync, Permissions.REMOTE_NOTIFICATIONS);
  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    //let user know how to turn on notifications
    return;
  }
  let token = yield call(Notifications.getExponentPushTokenAsync);
  //save the token to our backend
  if(false) {
    yield put({type: ActionTypes.NOTIFICATIONS_GRANTED});
  }
}
