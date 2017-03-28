import { put, takeLatest, select, call } from 'redux-saga/effects';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { URL, GET } from '../constants/rest';
//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchRegionChange() {
  yield takeLatest(ActionTypes.REGION_CHANGE, updateNearbyEvents);
}

function* updateNearbyEvents(action) {
  let { latitude, longitude } = action;
  let region = {
    latitude,
    longitude,
  };
  yield put({ type: ActionTypes.SET_REGION, region});
  //TODO: call to rest api here
  const user = yield select(state => state.user);
  const data = yield call(request, GET, URL + "/v1.0/events/?lat=" +
    region.latitude + "&long=" + region.longitude + "&scope=1000",
    {Authorization: user.secret, UserId: user.fbid}
  );
  yield put({ type: ActionTypes.SET_NEARBY, data });
}
