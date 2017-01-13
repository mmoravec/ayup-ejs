import { takeEvery, delay } from 'redux-saga'
import { put, call, take } from 'redux-saga/effects'
import ActionTypes from '../state/ActionTypes'

//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchRegionChange() {
  while (true) {
    const { latitude, longitude } = yield take(ActionTypes.REGION_CHANGE);
    yield call(updateNearbyEvents, latitude, longitude);
  }
}

function* updateNearbyEvents(latitude, longitude) {
  yield put({ type: ActionTypes.SET_NEARBY, latitude, longitude});
}
