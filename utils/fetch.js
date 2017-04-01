import { call, put, takeEvery, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import ActionTypes from '../state/ActionTypes';

export function* request(type, url, headers, body) {
  console.log('new request!');
  console.log(type + " : " + url);
  console.log(headers);
  let bodyString = "";
  if (body) {
    bodyString = JSON.stringify(body);
  }
  yield put({ type: ActionTypes.REQUEST_STARTED });
  try {
    let response = yield call(fetch, url, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: bodyString,
    });
    yield put({ type: ActionTypes.REQUEST_ENDED });
    console.log("request ended!");
    console.log(response);
    if (response.status === 200) {
      yield put({ type: ActionTypes.REQUEST_SUCCESS });
      let resJSON = yield response.json();
      return {body: resJSON, headers: response.headers};
    } else if (response.status === 401) {
      let error = yield response.json();
      yield put({ type: ActionTypes.REQUEST_UNAUTHENTICATED, error });
      return error;
      //TODO: create unauthorized func
    } else {
      yield put({ type: ActionTypes.REQUEST_ERROR });
      return {error: "Something is broken :("};
    }
  } catch (error) {
    yield put({ type: ActionTypes.REQUEST_ERROR });
    console.log('error', error);
    return {error};
  }


}
