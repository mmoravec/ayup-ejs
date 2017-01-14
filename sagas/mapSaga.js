import { takeLatest, delay } from 'redux-saga'
import { put, call, take } from 'redux-saga/effects'
import ActionTypes from '../state/ActionTypes'
import data from '../constants/sampledata.json'

//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchRegionChange() {
  yield takeLatest(ActionTypes.REGION_CHANGE, updateNearbyEvents);
}

function* updateNearbyEvents(action) {
  let { latitude, longitude } = action;
  //TODO: call to rest api here
  yield put({ type: ActionTypes.SET_NEARBY, data });
}
