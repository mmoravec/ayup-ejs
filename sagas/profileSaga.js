import Immutable, { List } from "immutable";
import { call, put, take, select, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";
import ActionTypes from "../state/ActionTypes";
import { request } from "../utils/fetch";
import { User } from "../state/Records";
import { URL, PUT, GET, POST } from "../constants/rest";

export function* watchProfile() {
  yield [
    takeLatest(
      [ActionTypes.SET_CREDENTIAL, ActionTypes.GET_PROFILE],
      getProfile
    ),
    takeLatest(ActionTypes.UPDATE_PROFILE, updateProfile),
  ];
}

export function* refreshUserFriends() {
  while (true) {
    yield take(ActionTypes.ROUTE_CHANGE);
    let friends;
    const cred = yield select(state => state.credential);
    const phone = yield select(state => state.phone);
    try {
      friends = yield call(
        request,
        GET,
        "https://graph.facebook.com/v2.8/me/friends/" +
          "?fields=name,id,picture.width(120).height(120)&" +
          "access_token=" +
          cred.access_token
      );
      let f = friends.body.data.map(friend => {
        return {
          name: friend.name,
          fbid: friend.id,
          profile_pic: friend.picture.data.url,
        };
      });
      //TODO: Only call synccontacts if fb list has changed or phone numbers have changed
      if (phone.fbFriends !== f) {
        yield put({ type: ActionTypes.SET_FBFRIENDS, friends: f });
        try {
          yield call(
            request,
            POST,
            URL + "/v1.0/account/synccontacts",
            { Authorization: user.secret, UserID: user.id },
            f
          );
        } catch (error) {
          //log error
          console.log("sync contacts error");
        }
      }
    } catch (error) {
      //log error
    }
    yield call(delay, 60000);
  }
}

function* getProfile() {
  let profile;
  try {
    profile = yield call(request, GET, URL + "/v1.0/profile");
  } catch (error) {
    console.log("error fetching profile");
    return;
  }
  yield put({ type: ActionTypes.SET_PROFILE, profile: profile.body });
}

function* updateProfile(action) {
  let profile;
  try {
    profile = yield call(request, PUT, URL + "/v1.0/profile", action.profile);
  } catch (error) {
    console.log("updating profile failed");
    console.log(error);
    return;
  }
  yield put({ type: ActionTypes.SET_PROFILE, profile: profile.body });
}
