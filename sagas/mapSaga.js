import { takeLatest, delay } from 'redux-saga'
import { put, call, take } from 'redux-saga/effects'
import ActionTypes from '../state/ActionTypes'

//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchRegionChange() {
  yield takeLatest(ActionTypes.REGION_CHANGE, updateNearbyEvents);
}

function* updateNearbyEvents(action) {
  let { latitude, longitude } = action;
  let response = yield call(
    fetch,
    `http://restbus.info/api/locations/${latitude},${longitude}/predictions`,
    { method: 'GET' }
  );
  let meow = yield response.json();
  yield put({ type: ActionTypes.SET_NEARBY, meow });
}
