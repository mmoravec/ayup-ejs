import {call, put, take, select, takeLatest} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import { List } from 'immutable';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { URL, POST, GET } from '../constants/rest';

export function* watchGetUserProfile() {
  yield takeLatest(ActionTypes.GET_PROFILE, getUserProfile);
}

export function* refreshUserFriends() {
    const action = yield take(ActionTypes.SET_CURRENT_USER);
    let friends = yield call(request, GET,
      "https://graph.facebook.com/v2.8/me/friends/" +
      "?fields=name,id,picture.width(120).height(120)&" +
      "access_token=" + action.user.authToken,
    );
    yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.body.data)});
    while (true) {
        yield call(delay, 30000);
        let newFriends = yield call(request, GET,
          "https://graph.facebook.com/v2.8/me/friends/" +
          "?fields=name,id,picture.width(120).height(120)&access_token=" + action.user.authToken,
        );
        if (newFriends.body.data.length !== friends.body.data.length) {
            friends = newFriends;
            yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.data)});
        }
    }
}

function* getUserProfile() {
  const user = yield select(state => state.user);
  if (user.id) {
    const data = yield call(request, GET, URL + "/profile?id=" + user.id,
      {Authorization: user.secret, UserId: user.id}
    );
    if (data && data.error) {
      //TODO: do something
      console.log(data.error);
    } else if (data) {
      console.log(data);
    }
  }
}
