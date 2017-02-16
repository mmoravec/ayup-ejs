import { takeLatest } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { List } from 'immutable';
import ActionTypes from '../state/ActionTypes';
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
  const data = new List(require('../constants/sampledata.json'));
  yield put({ type: ActionTypes.SET_NEARBY, data });
}
