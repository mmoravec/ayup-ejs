import { call, put, takeEvery, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
const getUser = state => state.user;

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
    let error = yield response.error();
    return error;
    //TODO: create unauthorized func
  } else {
    let error = yield response.error();
    return error;
  }
}

export function* request(type, url, headers) {
  let response = yield call(fetch, url, {
    method: type,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
  console.log(response);
  if (response.status === 200) {
    let resJSON = yield response.json();
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
