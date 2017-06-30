import { Notifications } from "expo";
import { List } from "immutable";
import { delay } from "redux-saga";
import { takeLatest, select, call, put, fork } from "redux-saga/effects";
import ActionTypes from "../state/ActionTypes";
import Actions from "../state/Actions";
import { Event } from "../state/Records";
import { request } from "../utils/fetch";
import Store from "../state/Store";
import { URL, POST, GET, DELETE } from "../constants/rest";

export function* watchNotificationActions() {
  yield [
    takeLatest(ActionTypes.SUBSCRIBE_NOTIFICATIONS, subscribeNotifications),
    takeLatest(ActionTypes.SET_PROFILE, setAlertBadges),
    takeLatest(ActionTypes.NOTIFICATION_RECEIVED, receivedNotification),
  ];
}

function* subscribeNotifications() {
  yield call(Notifications.addListener, _handleNotification);
}

function _handleNotification(notification) {
  Store.dispatch(Actions.receivedNotification(notification));
}

function* setAlertBadges() {
  let badges = 0, action = [];
  const profile = yield select(state => state.profile);
  profile.hosted.map(event => {
    if (event.requested && event.requested.length > 0) {
      badges++;
      action.push(event);
    }
  });
  profile.invited.map(event => {
    badges++;
    action.push(event);
  });
  yield put({ type: ActionTypes.SET_MYEVENT_BADGE, badges });
}

function* receivedNotification(action) {
  const event = yield select(state => state.events.selectedEvent);
  if (event && event.id === action.notification.data.event_id) {
    yield put({ type: ActionTypes.LOAD_EVENT, eventID: event.id });
    yield put({ type: ActionTypes.LOAD_COMMENTS, eventID: event.id });
  } else {
    yield put({
      type: ActionTypes.SHOW_NOTIFICATION,
      notification: action.notification,
    });
  }
}
