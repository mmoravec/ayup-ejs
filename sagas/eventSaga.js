import { takeLatest, select, call, put } from 'redux-saga/effects';
import {delay} from 'redux-saga';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { URL, POST, GET } from '../constants/rest';
//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchEventSave() {
  yield takeLatest(ActionTypes.SAVE_EVENT, saveEvent);
}

export function* watchRegionChange() {
  yield takeLatest(ActionTypes.REGION_CHANGE, updateNearbyEvents);
}

function* saveEvent(action) {
  const user = yield select(state => state.user);
  action.event.host = {
    userId: user.id,
    profilePic: user.profilePic,
    name: user.name,
  };
  yield put({ type: ActionTypes.ALERT_SAVING });
  const data = yield call(request, POST, URL + "/v1.0/events/",
    {Authorization: user.secret, UserId: user.id}, action.event
  );
  if (data && data.error) {
    //TODO: do something
    yield put({ type: ActionTypes.ALERT_ERROR });
    yield call(delay, 2000);
    yield put({ type: ActionTypes.RESET_ALERT });
  } else if (data) {
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
}

function* updateNearbyEvents(action) {
  //TODO: call to rest api here
  const user = yield select(state => state.user);
  let scope = 500;
  if (action.latitudeDelta < 0.01) {
    scope = 100;
  } else if (action.latitudeDelta < 0.02 && action.latitudeDelta > 0.01) {
    scope = 1000;
  } else if (action.latitudeDelta < 0.03 && action.latitudeDelta > 0.02) {
    scope = 5000;
  } else if (action.latitudeDelta < 0.06 && action.latitudeDelta > 0.03) {
    scope = 100000;
  } else if (action.latitudeDelta > 0.06) {
    scope = 1000000;
  }
  const data = yield call(request, GET, URL + "/v1.0/events?lat=" +
    action.latitude + "&long=" + action.longitude + "&scope=" + scope,
    {Authorization: user.secret, UserId: user.id}
  );
  if (data && data.error) {
    //TODO: do something
  } else if (data) {
    yield put({ type: ActionTypes.SET_NEARBY, data: data.body });
  }
}
