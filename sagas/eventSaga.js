import { List } from 'immutable';
import {delay} from 'redux-saga';
import { takeLatest, select, call, put, fork } from 'redux-saga/effects';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { URL, POST, GET } from '../constants/rest';
//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchEventAction() {
  yield [
    takeLatest(ActionTypes.SAVE_EVENT, saveEvent),
    takeLatest(ActionTypes.LOAD_EVENT, loadEvent),
    takeLatest(ActionTypes.REGION_CHANGE, updateNearbyEvents),
    takeLatest(ActionTypes.ACCEPT_EVENT, acceptEvent),
    takeLatest(ActionTypes.REQUEST_EVENT, requestEvent),
    takeLatest(ActionTypes.REJECT_EVENT, rejectEvent),
    takeLatest(ActionTypes.LOAD_COMMENTS, loadComments),
    takeLatest(ActionTypes.SAVE_COMMENT, saveComment),
    takeLatest(ActionTypes.GEOCODE, reverseGeocode),
  ];
}

function* saveEvent(action) {
  const user = yield select(state => state.user);
  action.event.host = {
    userId: user.id,
    profilePic: user.profilePic,
    name: user.name,
  };
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(request, POST, URL + "/v1.0/events",
      {Authorization: user.secret, UserID: user.id}, action.event
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR, error });
    yield call(delay, 2000);
    yield put({ type: ActionTypes.RESET_ALERT });
    return;
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield call(delay, 2000);
  yield put({ type: ActionTypes.RESET_ALERT });
  yield put({
    type: ActionTypes.REGION_CHANGE,
    longitude: action.event.location.coordinates[0],
    latitude: action.event.location.coordinates[1],
   });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: 'Home'});
}

function* updateNearbyEvents(action) {
  //TODO: call to rest api here
  const user = yield select(state => state.user);
  let scope = Math.floor(action.latitudeDelta * 53000), events;
  try {
    events = yield call(request, GET, URL + "/v1.0/events?lat=" +
      action.latitude + "&long=" + action.longitude + "&scope=" + scope,
      {Authorization: user.secret, UserID: user.id}
    );
  } catch (error) {
    return;
  }
  yield put({ type: ActionTypes.SET_NEARBY, data: events.body });
}

function* acceptEvent(action) {
  const user = yield select(state => state.user);
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(request, POST, URL + "/v1.0/events/" + action.eventID +
      "?fbid=" + user.fbid + "&action=accept",
      {Authorization: user.secret, UserID: user.id}
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
    yield call(delay, 2000);
    yield put({ type: ActionTypes.RESET_ALERT });
    return;
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield call(delay, 2000);
  yield put({ type: ActionTypes.RESET_ALERT });
}

function* requestEvent(action) {
  const user = yield select(state => state.user);
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(request, POST, URL + "/v1.0/events/" + action.eventID +
      "?fbid=" + user.fbid + "&action=request",
      {Authorization: user.secret, UserID: user.id}
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
    yield call(delay, 2000);
    yield put({ type: ActionTypes.RESET_ALERT });
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield call(delay, 2000);
  yield put({ type: ActionTypes.RESET_ALERT });
  yield fork(updateSelectedEvent, action.eventID, user);
}

function* rejectEvent(action) {
  const user = yield select(state => state.user);
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(request, POST, URL + "/v1.0/events/" + action.eventID +
      "?fbid=" + user.fbid + "&action=reject",
      {Authorization: user.secret, UserID: user.id}
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
    yield call(delay, 2000);
    yield put({ type: ActionTypes.RESET_ALERT });
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield call(delay, 2000);
  yield put({ type: ActionTypes.RESET_ALERT });
  yield fork(updateSelectedEvent, action.eventID, user);
}

function* updateSelectedEvent(eventID, user) {
  let data;
  try {
    data = yield call(request, GET, URL + "/v1.0/events?id=" + eventID,
      {Authorization: user.secret, UserID: user.id}
    );
  } catch (error) {
    yield call(delay, 5000);
    yield fork(updateSelectedEvent, eventID, user);
    return;
  }
  yield put({ type: ActionTypes.SET_SELECTED_EVENT, selectedEvent: data.body});
}

function* loadComments(action) {
  const user = yield select(state => state.user);
  let data;
  try {
    data = yield call(request, GET, URL + '/v1.0/comments?id=' + action.eventID,
    {Authorization: user.secret, UserID: user.id});
  } catch (error) {
    yield call(delay, 5000);
    yield fork(loadComments, action);
    return;
  }
  yield put({ type: ActionTypes.SET_COMMENTS, comments: new List(data.body)});
}

function* saveComment(action) {
  const user = yield select(state => state.user);
  console.log(action);
  let comment = {
    content: action.comment,
    parentID: action.parentID ? action.parentID : null,
    author: {
      fbid: user.fbid,
      id: user.id,
      profilePic: user.profilePic,
      name: user.name,
    },
    eventID: action.eventID,
  };
  try {
    yield call(request, POST, URL + '/v1.0/comments',
    {Authorization: user.secret, UserID: user.id}, comment);
  } catch (error) {
    yield call(delay, 5000);
    yield fork(saveComment, action);
    return;
  }
  yield call(loadComments, action);
}

function* loadEvent(action) {
  const user = yield select(state => state.user);
  let data;
  try {
    data = yield call(request, GET, URL + '/v1.0/events?id=' + action.eventID,
    {Authorization: user.secret, UserID: user.id});
  } catch (error) {
    yield call(delay, 5000);
    yield fork(loadEvent, action);
    return;
  }
  yield put({ type: ActionTypes.SET_SELECTED_EVENT, selectedEvent: data.body});
}

function* reverseGeocode(action) {
  console.log(action);
  let data;
  try {
    data = yield call(request, GET, 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + action.lat + ',' + action.long + '&key=AIzaSyAU9hsZ7WU1DkT8na9GHBwuldoBWccctjI');
  } catch (error) {
    return;
  }
  if (data.body.results[0]) {
    data = {
      lat: action.lat,
      long: action.long,
      name: data.body.results[0].formatted_address,
    };
    yield put({ type: ActionTypes.SET_GEOCODE_ADDRESS, data });
  }
  return;
}
