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
  ];
}

function* subscribeNotifications() {
  console.log("subscribe note called");
  yield call(Notifications.addListener, _handleNotification);
}

function _handleNotification(notification) {
  console.log("handle notification");
  let test = notification.data;
  Store.dispatch(Actions.receivedNotification(notification));
}

function* setAlertBadges() {
  let badges = 0;
  const profile = yield select(state => state.profile);
  profile.hosted.map(event => {
    if (event.requested.length > 0) {
      badges++;
    }
  });
  yield put({ type: ActionTypes.SET_MYEVENT_BADGE, badges });
}
