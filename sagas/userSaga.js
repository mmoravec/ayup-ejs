import Immutable, { List } from 'immutable';
import {call, put, take, select, takeLatest} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { User } from '../state/Records';
import { URL, PUT, GET } from '../constants/rest';

export function* watchGetProfile() {
  yield takeLatest(ActionTypes.GET_PROFILE, getProfile);
}

export function* watchSyncProfile() {
  yield takeLatest(ActionTypes.SYNC_PROFILE, syncProfile);
}

export function* refreshUserFriends() {
    const action = yield take(ActionTypes.SET_CURRENT_USER);
    let friends = yield call(request, GET,
      "https://graph.facebook.com/v2.8/me/friends/" +
      "?fields=name,id,picture.width(120).height(120)&" +
      "access_token=" + action.user.authToken,
    );
    if (friends.error) {
      //TODO: create error logging
    } else if (friends) {
      yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.body.data)});
    }
    while (true) {
        yield call(delay, 30000);
        let newFriends = yield call(request, GET,
          "https://graph.facebook.com/v2.8/me/friends/" +
          "?fields=name,id,picture.width(120).height(120)&access_token=" + action.user.authToken,
        );
        if (newFriends && newFriends.error) {
          //TODO: create error logging
        } else if (newFriends) {
          if (newFriends.body.data.length !== friends.body.data.length) {
              friends = newFriends;
              yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.body.data)});
          }
        }
    }
}

function* getProfile() {
  const user = yield select(state => state.user);
  if (user.secret) {
    const data = yield call(request, GET, URL + "/v1.0/profile?id=" + user.id,
      {Authorization: user.secret, UserID: user.id}
    );
    return data;
  }
}

function* syncProfile() {
  const p = yield select(state => state.user);
  let profile = yield call(getProfile);
  if (!profile instanceof Error) {
    profile = profile.body;
    let user = {
      hosted: profile.hosted,
      invited: profile.invited,
      completed: profile.completed,
      rejected: profile.rejected,
      requested: profile.requested,
      joined: profile.joined,
      events: profile.events,
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
      badges: profile.badges,
      activities: profile.activities,
      secret: p.secret,
    };
    user = new User(Immutable.fromJS(user));
    yield put({ type: ActionTypes.SET_CURRENT_USER, user });
    yield call(updateProfile, user);
  } else {
    console.log('Error fetching profile! Error message:');
    console.log(profile);
    yield call(delay, 5000);
    yield call(syncProfile);
  }
}

function* updateProfile(user) {
  user = user ? user : yield select(state => state.user);
  if (user.secret) {
    const data = yield call(request, PUT, URL + "/v1.0/profile?id=" + user.id,
      {Authorization: user.secret, UserID: user.id}, user.toJS()
    );
    if(data.error) return;
    yield put({ type: ActionTypes.PROFILE_UPDATED });
    return data;
  }
}
