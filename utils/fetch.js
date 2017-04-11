import { call, put, takeEvery, select, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import ActionTypes from '../state/ActionTypes';

export function* request(type, url, headers, body) {
  console.log('new request!');
  console.log(type + " : " + url);
  console.log(headers);
  let bodyString = "";
  if (body) {
    bodyString = JSON.stringify(body);
    console.log(bodyString);
  }
  yield put({ type: ActionTypes.REQUEST_STARTED });
  try {
    const {response, timeout} = yield race({
      response: call(fetch, url, {
        method: type,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: bodyString,
      }),
      timeout: call(delay, 5000),
    });
    console.log(response);
    console.log(timeout);
    if (response) {
      yield put({ type: ActionTypes.REQUEST_ENDED });
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
        let error = yield response.json();
        yield put({ type: ActionTypes.REQUEST_ERROR });
        return {error};
      }
    } else {
      yield put({ type: ActionTypes.REQUEST_ERROR });
      return new Error('Request timed out');
    }
  } catch (error) {
    yield put({ type: ActionTypes.REQUEST_ERROR });
    console.log('error', error);
    return {error};
  }


}
