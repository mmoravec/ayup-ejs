import _ from "lodash";
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
    takeLatest(ActionTypes.ADD_NOTIFICATION, addNotification),
    takeLatest(ActionTypes.REMOVE_NOTIFICATION, removeNotification),
    takeLatest(ActionTypes.CANCEL_EVENT_NOTIFICATIONS, cancelEventNotifications),
  ];
}

function* addNotification(action) {
  let event;
  const notifications = yield select(state => state.phone.localNotifications);
  let newNotifications = { ...notifications };
  if (!newNotifications[action.event.id]) {
    newNotifications[action.event.id] = {};
  } else if (
    _.find(
      _.map(newNotifications[action.event.id], e => {
        return e;
      }),
      ["value", action.notification.value]
    )
  ) {
    return;
  }
  let localNotification = {
    title: "Reminder",
    body: "Your event '" +
      action.event.title +
      "' will start in " +
      action.notification.title,
  };
  let schedulingOptions = {
    time: action.notification.value,
    //1000 is 1 second from now
  };
  let result = yield Notifications.scheduleLocalNotificationAsync(
    localNotification,
    schedulingOptions
  );
  newNotifications[action.event.id][result] = {
    ...action.notification,
    id: result,
  };
  yield put({
    type: ActionTypes.SET_LOCAL_NOTIFICATIONS,
    notifications: newNotifications,
  });
}

function* removeNotification(action) {
  const notifications = yield select(state => state.phone.localNotifications);
  let newNotifications = { ...notifications };
  yield Notifications.cancelScheduledNotificationAsync(action.notification.id);
  _.unset(newNotifications, [action.event.id, action.notification.id]);
  yield put({
    type: ActionTypes.SET_LOCAL_NOTIFICATIONS,
    notifications: newNotifications,
  });
}

function* cancelEventNotifications(action) {
  const notifications = yield select(state => state.phone.localNotifications);
  let newNotifications = { ...notifications };
  _.map(newNotifications[action.eventID], notification => {
    Notifications.cancelScheduledNotificationAsync(notification.id);
  });
  _.unset(newNotifications, action.eventID);
  yield put({
    type: ActionTypes.SET_LOCAL_NOTIFICATIONS,
    notifications: newNotifications,
  });
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
  yield put({ type: ActionTypes.GET_PROFILE });
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
