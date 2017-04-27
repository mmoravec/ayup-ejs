import Immutable, { List } from 'immutable';
import {call, put, take, select, takeLatest} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { User } from '../state/Records';
import { URL, PUT, GET } from '../constants/rest';

// export function* watchGettingStarted() {
//   yield takeLatest(ActionTypes.SYNC_PROFILE, syncProfile);
// }
