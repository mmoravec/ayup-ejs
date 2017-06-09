import { call, put, takeEvery, select, race } from "redux-saga/effects";
import { delay } from "redux-saga";
import axios from "axios";
import ActionTypes from "../state/ActionTypes";

export function* request(type, url, body, headers) {
  // console.log("new request!");
  // console.log(type + " : " + url);
  // console.log(headers);
  const cred = yield select(state => state.credential);
  // console.log("current credentials");
  // console.log(cred);
  let bodyString = "";
  if (body) {
    // console.log("stringifying data");
    // console.log(body);
    bodyString = JSON.stringify(body);
    // console.log(bodyString);
  }
  yield put({ type: ActionTypes.REQUEST_STARTED });
  // console.log(cred);
  try {
    const { response } = yield race({
      response: call(axios, {
        method: type,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: cred.secret,
          UserID: cred.user_id,
          ...headers,
        },
        data: type === "GET" ? null : bodyString,
      }),
      timeout: call(delay, 5000),
    });
    // console.log(response);
    if (response) {
      // console.log(response);
      yield put({ type: ActionTypes.REQUEST_ENDED });
      if (response.status === 200) {
        yield put({ type: ActionTypes.REQUEST_SUCCESS });
        // console.log("request success : " + url);
        return { body: response.data, headers: response.headers };
      } else if (response.status === 401) {
        // console.log("request 401");
        // console.log(error);
        yield put({
          type: ActionTypes.REQUEST_UNAUTHENTICATED,
          response: response.statusText,
        });
        //TODO: create unauthorized func
      } else {
        let error = yield response.json();
        // console.log("request error but has reponse");
        // console.log(error);
        // console.log(response.status);
        yield put({ type: ActionTypes.REQUEST_ERROR });
        throw error;
      }
    } else {
      yield put({ type: ActionTypes.REQUEST_ERROR });
      throw new Error("Request timed out");
    }
  } catch (error) {
    yield put({ type: ActionTypes.REQUEST_ERROR });
    throw error;
  }
}

export function* fb(login) {
  try {
    console.log("login");
    console.log(login);
    const { response } = yield race({
      response: call(
        fetch,
        `https://graph.facebook.com/me?access_token=${login.token}&fields=name,id,gender,picture.width(240).height(240),email,age_range,verified`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
      timeout: call(delay, 5000),
    });
    let res = yield response.json();
    console.log("response");
    console.log(res);
    return res;
  } catch (error) {
    yield put({ type: ActionTypes.REQUEST_ERROR });
    // console.log("request error no response");
    // console.log(error);
    throw new Error(error);
  }
}
