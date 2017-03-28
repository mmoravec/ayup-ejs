import { call, put, takeEvery, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

export function* ayupLogin(url, token) {
  console.log("called func:" + token);
  let response = yield call(fetch, url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Token": token,
    },
  });
  console.log(response);
  if (response.status === 200) {
    let resJSON = yield response.json();
    resJSON.secret = response.headers.get('authorization');
    return resJSON;
  } else if (response.status === 401) {
    //TODO: create unauthorized func
  }
}
