import { List } from "immutable";
import { delay } from "redux-saga";
import { takeLatest, select, call, put, fork } from "redux-saga/effects";
import ActionTypes from "../state/ActionTypes";
import { request } from "../utils/fetch";
import { URL, POST, GET, DELETE } from "../constants/rest";
//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchEventAction() {
  yield [
    takeLatest(ActionTypes.SAVE_EVENT, saveEvent),
    takeLatest(ActionTypes.LOAD_EVENT, loadEvent),
    takeLatest(ActionTypes.REGION_CHANGE, updateNearbyEvents),
    takeLatest(ActionTypes.ACCEPT_EVENT, acceptEvent),
    takeLatest(ActionTypes.REQUEST_EVENT, requestEvent),
    takeLatest(ActionTypes.DELETE_EVENT, deleteEvent),
    takeLatest(ActionTypes.REJECT_EVENT, rejectEvent),
    takeLatest(ActionTypes.LOAD_COMMENTS, loadComments),
    takeLatest(ActionTypes.SAVE_COMMENT, saveComment),
  ];
}

function* saveEvent(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  console.log(action.event);
  try {
    yield call(request, POST, URL + "/v1.0/events", action.event);
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR, error });
    return;
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield call(delay, 2000);
  yield put({
    type: ActionTypes.REGION_CHANGE,
    longitude: action.event.location.coordinates[0],
    latitude: action.event.location.coordinates[1],
  });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Back" });
}

function* updateNearbyEvents(action) {
  //TODO: call to rest api here
  let region = {
    latitude: action.latitude,
    longitude: action.longitude,
    latitudeDelta: action.latitudeDelta ? action.latitudeDelta : 0.0249666,
    longitudeDelta: action.longitudeDelta ? action.longitudeDelta : 0.017766,
  };
  let scope = Math.floor(region.latitudeDelta * 53000), events;
  console.log("udpatenearbyevents");
  console.log(region);
  try {
    events = yield call(
      request,
      GET,
      URL +
        "/v1.0/events?lat=" +
        region.latitude +
        "&long=" +
        region.longitude +
        "&scope=" +
        scope
    );
  } catch (error) {
    return;
  }
  yield put({ type: ActionTypes.SET_NEARBY, data: events.body });
}

function* acceptEvent(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(request, POST, URL + "/v1.0/events/" + action.eventID);
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
    return;
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
}

function* requestEvent(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(request, POST, URL + "/v1.0/events/" + action.eventID);
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield call(updateSelectedEvent, action.eventID);
}

function* deleteEvent(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(request, DELETE, URL + "/v1.0/events?id=" + action.eventID);
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield fork(updateSelectedEvent, action.eventID);
}

function* rejectEvent(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(
      request,
      POST,
      URL + "/v1.0/events/" + action.eventID + "?fbid="
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield fork(updateSelectedEvent, action.eventID);
}

function* updateSelectedEvent(eventID) {
  let data;
  try {
    data = yield call(request, GET, URL + "/v1.0/events/" + eventID);
  } catch (error) {
    yield call(delay, 5000);
    yield fork(updateSelectedEvent, eventID);
    return;
  }
  yield put({ type: ActionTypes.SET_SELECTED_EVENT, selectedEvent: data.body });
}

function* loadComments(action) {
  let data;
  try {
    data = yield call(request, GET, URL + "/v1.0/comments/" + action.eventID);
  } catch (error) {
    yield call(delay, 5000);
    yield fork(loadComments, action);
    return;
  }
  yield put({ type: ActionTypes.SET_COMMENTS, comments: new List(data.body) });
}

function* saveComment(action) {
  const user = yield select(state => state.user);
  let comment = {
    content: action.comment,
    parentID: action.parentID ? action.parentID : null,
    author: {
      fbid: user.fbid,
      id: user.id,
      profile_pic: user.profile_pic,
      name: user.name,
    },
    eventID: action.eventID,
  };
  try {
    yield call(request, POST, URL + "/v1.0/comments", comment);
  } catch (error) {
    yield call(delay, 5000);
    yield fork(saveComment, action);
    return;
  }
  yield call(loadComments, action);
}

function* loadEvent(action) {
  let data;
  try {
    data = yield call(request, GET, URL + "/v1.0/events/" + action.eventID);
  } catch (error) {
    yield call(delay, 5000);
    yield fork(loadEvent, action);
    return;
  }
  yield put({ type: ActionTypes.SET_SELECTED_EVENT, selectedEvent: data.body });
}
