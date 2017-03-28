import { takeLatest, select, call } from 'redux-saga/effects';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { URL, POST } from '../constants/rest';
//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchEventSave() {
  yield takeLatest(ActionTypes.SAVE_EVENT, saveEvent);
}

function* saveEvent(action) {
  const user = yield select(state => state.user);
  const data = yield call(request, POST, URL + "/v1.0/events/",
    {Authorization: user.secret, UserId: user.fbid}, action.event
  );
}
