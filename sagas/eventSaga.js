import { takeLatest, select, call, put } from 'redux-saga/effects';
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
  console.log(user.secret);
  console.log(user);
  const data = yield call(request, POST, URL + "/v1.0/events/",
    {Authorization: user.secret, UserId: user.fbid}, action.event
  );
  console.log(data);
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
  const data = yield call(request, GET, URL + "/v1.0/events/?lat=" +
    action.latitude + "&long=" + action.longitude + "&scope=" + scope,
    {Authorization: user.secret, UserId: user.fbid}
  );
  if (data && data.error) {
    //TODO: do something
  } else {
    yield put({ type: ActionTypes.SET_NEARBY, data });
  }
}
