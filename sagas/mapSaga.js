import { takeEvery, delay } from 'redux-saga'
import { put, call, take } from 'redux-saga/effects'
import ActionTypes from '../state/ActionTypes'

//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchRegionChange() {
  while (true) {
    const { latitude, longitude } = yield take(ActionTypes.REGION_CHANGE);
    yield call(updateNearbyEvents, latitude, longitude);
    yield delay(1000);
  }
}

function* updateNearbyEvents(latitude, longitude) {
  let response = yield call(
    fetch,
    `http://restbus.info/api/locations/${latitude},${longitude}/predictions`,
    { method: 'GET' }
  );
  let meow = response.json();
  yield put({ type: ActionTypes.SET_NEARBY, meow });
}
