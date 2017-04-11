import Immutable, { List } from 'immutable';
import {call, put, take, select, takeLatest} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import ActionTypes from '../state/ActionTypes';
import { request } from '../utils/fetch';
import { User } from '../state/Records';
import { URL, PUT, GET } from '../constants/rest';

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
    yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.body.data)});
    while (true) {
        yield call(delay, 30000);
        let newFriends = yield call(request, GET,
          "https://graph.facebook.com/v2.8/me/friends/" +
          "?fields=name,id,picture.width(120).height(120)&access_token=" + action.user.authToken,
        );
        console.log(newFriends);
        if (newFriends && newFriends.error) {
          //TODO: create error logging
        } else if (newFriends) {
            yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.body.data)});
        }
    }
}


function* syncProfile() {
  let profile = null;
  const p = yield select(state => state.user);
  if (!p.secret) {
    yield put({ type: ActionTypes.REQUEST_UNAUTHENTICATED, error: "no user secret" });
  }
  try {
    profile = yield call(request, GET, URL + "/v1.0/profile?id=" + p.id,
      {Authorization: p.secret, UserID: p.id}
    );
    console.log("DIDNT CATCH ERROR");
  } catch (error) {
    console.log("CAUGHT PROFILE ERROR");
    yield call(delay, 5000);
    yield call(syncProfile);
    return;
  }
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
}

function* updateProfile(user) {
  user = user ? user : yield select(state => state.user);
  if (user.secret) {
    const data = yield call(request, PUT, URL + "/v1.0/profile?id=" + user.id,
      {Authorization: user.secret, UserID: user.id}, user.toJS()
    );
    if (data.error) return;
    yield put({ type: ActionTypes.PROFILE_UPDATED });
    return data;
  }
}
