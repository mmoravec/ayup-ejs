import { call, put, takeEvery, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import ActionTypes from '../state/ActionTypes';

export function* ayupLogin(url, token) {
  let response = yield call(fetch, url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Token": token,
    },
  });
  if (response.status === 200) {
    let resJSON = yield response.json();
    resJSON.secret = response.headers.get('authorization');
    return resJSON;
  } else if (response.status === 401) {
    let error = yield response.json();
    return error;
    //TODO: create unauthorized func
  } else {
    let error = yield response.json();
    return error;
  }
}

export function* request(type, url, headers, body) {
  let bodyString = "";
  if (body) {
    bodyString = JSON.stringify(body);
    console.log(bodyString);
  }
  yield put({ type: ActionTypes.REQUEST_STARTED });
  let response = yield call(fetch, url, {
    method: type,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    bodyString,
  });
  yield put({ type: ActionTypes.REQUEST_ENDED });
  if (response.status === 200) {
    yield put({ type: ActionTypes.REQUEST_SUCCESS });
    let resJSON = yield response.json();
    return resJSON;
  } else if (response.status === 401) {
    let error = yield response.json();
    yield put({ type: ActionTypes.REQUEST_UNAUTHENTICATED, error });
    return error;
    //TODO: create unauthorized func
  } else {
    let error = yield response.json();
    yield put({ type: ActionTypes.REQUEST_ERROR, error });
    return error;
  }
}
