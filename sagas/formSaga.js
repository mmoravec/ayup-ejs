import { List } from 'immutable';
import {delay} from 'redux-saga';
import { takeLatest, select, call, put, fork } from 'redux-saga/effects';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { URL, POST, GET, DELETE } from '../constants/rest';

export function* watchFormActions() {
  yield [
    takeLatest(ActionTypes.GEOCODE, reverseGeocode),
  ];
}

function* reverseGeocode(action) {
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
    yield put({ type: ActionTypes.SET_GEOCODE_ADDRESS, data, stateKey: action.stateKey });
  }
  return;
}
