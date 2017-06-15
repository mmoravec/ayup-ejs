import Immutable, { List } from "immutable";
import { call, put, take, select, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";
import ActionTypes from "../state/ActionTypes";
import { request } from "../utils/fetch";
import { Profile } from "../state/Records";
import { URL, PUT, GET, POST } from "../constants/rest";

export function* watchProfile() {
  yield [
    takeLatest([ActionTypes.GET_PROFILE], getProfile),
    takeLatest(ActionTypes.UPDATE_PROFILE, updateProfile),
    takeLatest(ActionTypes.CONTACTS_RECEIVED, receivedContacts),
    takeLatest(ActionTypes.GET_FBFRIENDS, getFacebookFriends),
  ];
}

function* getFacebookFriends() {
  let friends, f = {};
  const cred = yield select(state => state.credential);
  try {
    friends = yield call(
      request,
      GET,
      "https://graph.facebook.com/v2.8/me/friends/" +
        "?fields=name,id,picture.width(120).height(120)&" +
        "access_token=" +
        cred.access_token
    );
    friends.body.data.map(friend => {
      f[friend.name] = {
        fbid: friend.fbid,
      };
    });
  } catch (error) {
    //log error
  }
  return f;
}

function* sortContacts(contacts) {
  let friends = {};
  let f = contacts.data.map(c => {
    if (c.phoneNumbers.length > 0) {
      c.phoneNumbers.map(num => {
        let phone = num.number.replace(/\D/g, "");
        if (phone[0] === "1") {
          phone = phone.slice(1);
        }
        if (phone.length === 10) {
          if (!friends[c.name]) {
            friends[c.name] = [];
          }
          friends[c.name].push(phone);
        }
      });
    }
  });
  return friends;
}

function* receivedContacts(action) {
  const phone = yield select(state => state.phone);
  let result = yield [
    call(sortContacts, action.contacts),
    call(getFacebookFriends),
  ];
  if (Object.keys(phone.contacts).length !== Object.keys(result[0]).length) {
    yield put({ type: ActionTypes.SET_CONTACTS, contacts: result[0] });
  }
  if (Object.keys(phone.fbFriends).length !== Object.keys(result[1]).length) {
    yield put({ type: ActionTypes.SET_FBFRIENDS, friends: result[1] });
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
  console.log(profile.body);
  yield put({ type: ActionTypes.SET_PROFILE, profile: profile.body });
}

//TODO: eventually use this, until then sync
// function* updateProfile(action) {
//   let profile;
//   try {
//     profile = yield call(request, PUT, URL + "/v1.0/profile", action.profile);
//   } catch (error) {
//     console.log("updating profile failed");
//     console.log(error);
//     return;
//   }
//   yield put({ type: ActionTypes.SET_PROFILE, profile: profile.body });
// }

function* updateProfile(action) {
  let profile;
  try {
    profile = yield call(request, PUT, URL + "/v1.0/profile", action.profile);
  } catch (error) {
    console.log("error fetching profile");
    return;
  }
  yield put({ type: ActionTypes.SET_PROFILE, profile: profile.body });
}
