import {call, put, take, select, takeLatest} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import { List } from 'immutable';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { User } from '../state/Records';
import { URL, POST, GET } from '../constants/rest';

export function* watchGetProfile() {
  yield takeLatest(ActionTypes.GET_PROFILE, getProfile);
}

export function* watchSyncProfile() {
  yield takeLatest(ActionTypes.SYNC_PROFILE, syncProfile);
}

export function* watchUpdateProfile() {
  yield takeLatest(ActionTypes.UPDATE_PROFILE, updateProfile);
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

function* getProfile() {
  const user = yield select(state => state.user);
  if (user.secret) {
    const data = yield call(request, GET, URL + "/v1.0/profile?id=" + user.id,
      {Authorization: user.secret, UserId: user.id}
    );
    return data;
  }
}

function* syncProfile() {
  const p = yield select(state => state.user);
  let profile = yield call(getProfile);
  if (!profile.error) {
    profile = profile.body;
    let user = {
      hosted: new List(profile.hosted),
      invited: new List(profile.invited),
      completed: new List(profile.completed),
      rejected: new List(profile.rejected),
      requested: new List(profile.requested),
      joined: new List(profile.joined),
      id: profile.id,
      fbid: p.fbid,
      about: p.about,
      authToken: p.authToken,
      name: p.name,
      profilePic: p.profilePic,
      friends: p.friends,
      email: p.email,
      gender: p.gender,
      new: p.new,
      expires: p.expires,
      badges: new List(profile.badges),
      activities: new List(profile.activities),
      secret: p.secret,
    };
    user = new User(user);
    yield put({ type: ActionTypes.SET_CURRENT_USER, user });
    yield call(updateProfile);
    //yield call(updateProfile);
  }

  //TODO: merge current profile with profile from server and save
}

function* updateProfile() {
  const user = yield select(state => state.user);
  if (user.secret) {
    const data = yield call(request, POST, URL + "/v1.0/profile?id=" + user.id,
      {Authorization: user.secret, UserId: user.id}, JSON.stringify(user)
    );
    return data;
  }
}
