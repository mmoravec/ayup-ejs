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
  while (true) {
    yield take(ActionTypes.ROUTE_CHANGE);
    const user = yield select(state => state.user);
    let friends;
    try {
      friends = yield call(request, GET,
        "https://graph.facebook.com/v2.8/me/friends/" +
        "?fields=name,id,picture.width(120).height(120)&" +
        "access_token=" + user.authToken,
      );
      let f = friends.body.data.map(friend => {
        return {
          name: friend.name,
          fbid: friend.id,
          profilePic: friend.picture.data.url,
        };
      });
      yield put({type: ActionTypes.SET_FRIENDS, friends: new List(f)});
    } catch (error) {
      //log error
    }
    yield call(delay, 60000);
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
  } catch (error) {
    yield call(delay, 5000);
    yield call(syncProfile);
    return;
  }
  profile = profile.body;
  // console.log('profile here');
  // console.log(profile);
  let user = {
    hosted: Immutable.fromJS(profile.hosted),
    invited: Immutable.fromJS(profile.invited),
    completed: Immutable.fromJS(profile.completed),
    rejected: Immutable.fromJS(profile.rejected),
    requested: Immutable.fromJS(profile.requested),
    joined: Immutable.fromJS(profile.joined),
    events: profile.events === null ? p.events : new List(profile.events),
    id: profile.id,
    fbid: p.fbid,
    about: p.about,
    authToken: p.authToken,
    name: p.name,
    profilePic: p.profilePic,
    friends: p.friends,
    email: p.email,
    gender: p.gender,
    new: false,
    expires: p.expires,
    badges: Immutable.fromJS(profile.badges),
    activities: Immutable.fromJS(profile.activities),
    secret: p.secret,
  };
  user = new User(Immutable.fromJS(user));
  yield put({ type: ActionTypes.SET_CURRENT_USER, user });
  try {
    yield call(request, PUT, URL + "/v1.0/profile?id=" + user.id,
      {Authorization: user.secret, UserID: user.id}, user.toJS()
    );
  } catch (error) {
    // console.log('updaing profile failed');
    return;
  }
  yield put({ type: ActionTypes.PROFILE_UPDATED });
}
