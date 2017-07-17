import _ from "lodash";
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
  let friends, f = [];
  const cred = yield select(state => state.credential);
  try {
    friends = yield call(
      request,
      GET,
      "https://graph.facebook.com/v2.8/me/friends/" +
        "?limit=5000&fields=name,id,picture.width(120).height(120)&" +
        "access_token=" +
        cred.access_token
    );
    friends.body.data.map(friend => {
      f.push({
        fbid: friend.id,
        name: friend.name,
        profile_pic: friend.picture.data.url,
      });
    });
  } catch (error) {
    //log error
  }
  return f;
}

function* sortContacts(contacts) {
  let friends = [];
  let f = contacts.data.map(c => {
    if (c.phoneNumbers.length > 0) {
      c.phoneNumbers.map(num => {
        if (!num.number) {
          return;
        }
        let phone = num.number.replace(/\D/g, "");
        if (phone[0] === "1") {
          phone = phone.slice(1);
        }
        if (phone.length === 10) {
          friends.push({
            phone,
            name: c.name,
            label: num.label,
          });
        }
      });
    }
  });
  return friends;
}

function* receivedContacts(action) {
  let sync = false, contacts;
  const phone = yield select(state => state.phone);
  let result = yield [
    call(sortContacts, action.contacts),
    call(getFacebookFriends),
  ];
  if (Object.keys(phone.contacts).length !== Object.keys(result[0]).length) {
    yield put({ type: ActionTypes.SET_CONTACTS, contacts: result[0] });
    sync = true;
  }
  if (Object.keys(phone.fbFriends).length !== Object.keys(result[1]).length) {
    yield put({ type: ActionTypes.SET_FBFRIENDS, friends: result[1] });
    sync = true;
  }
  let blah = result[1].concat(result[0]);
  if (sync) {
    try {
      contacts = yield call(
        request,
        POST,
        URL + "/v1.0/account/synccontacts",
        blah
      );
    } catch (error) {
      return;
    }
    yield call(delay, 1000);
    yield call(getProfile);
  }
}

export function* getProfile() {
  let profile;
  try {
    profile = yield call(request, GET, URL + "/v1.0/profile");
  } catch (error) {
    return;
  }
  profile = transformEvents(profile.body);
  profile.friends = filterFriends(profile);
  // console.log(profile);
  yield put({ type: ActionTypes.SET_PROFILE, profile });
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
    return;
  }
  profile = transformEvents(profile.body);
  profile.friends = filterFriends(profile);
  yield put({ type: ActionTypes.SET_PROFILE, profile });
}

function transformEvents(profile) {
  let temp = {
    hosted: [],
    going: [],
    invited: [],
    requested: [],
    not_going: [],
    completed: [],
    take_action: [],
    deleted: [],
  };
  if (!profile.events) {
    return profile;
  }
  profile.events.map(event => {
    if (profile.hosted.indexOf(event.id) > -1) {
      temp.hosted.push(event);
    } else if (profile.completed.indexOf(event.id) > -1) {
      temp.completed.push(event);
    } else if (profile.going.indexOf(event.id) > -1) {
      temp.going.push(event);
    } else if (profile.invited.indexOf(event.id) > -1) {
      temp.invited.push(event);
      temp.take_action.push(event);
    } else if (profile.requested.indexOf(event.id) > -1) {
      temp.requested.push(event);
    } else if (profile.not_going.indexOf(event.id) > -1) {
      temp.not_going.push(event);
    } else if (profile.deleted.indexOf(event.id) > -1) {
      temp.deleted.push(event);
    }
  });
  temp.all = temp.hosted.concat(temp.invited, temp.requested, temp.going);
  temp.archive = temp.completed.concat(temp.not_going, temp.deleted);
  temp.hosted.map(event => {
    if (event.requested.length > 0) {
      temp.take_action.push(event);
    }
  });
  for (var k in temp) {
    profile[k] = new List(temp[k]);
  }
  return profile;
}

function filterFriends(profile) {
  let f = {}, m = {}, p = [];
  if (!profile.friends) {
    return;
  }
  profile.friends.map(friend => {
    if (friend.profile_pic) {
      m[friend.name] = friend;
    } else if (!f[friend.name]) {
      f[friend.name] = [friend];
    } else {
      f[friend.name].push(friend);
    }
  });
  _.forIn(f, (val, key) => {
    if (m[key]) {
      p.push(m[key]);
      delete m[key];
    } else {
      p = p.concat(val);
    }
  });
  p = p.concat(_.values(m));
  p = p.filter(per => {
    return per.profile_pic || per.phone;
  });
  p = p.map(per => {
    if (per.phone) {
      per.phone =
        "(" +
        per.phone.substring(0, 3) +
        ") " +
        per.phone.substring(3, 6) +
        "-" +
        per.phone.substring(6);
    } else if (per.name.indexOf(" ") > -1) {
      per.first_name = per.name.substring(0, per.name.indexOf(" "));
    }
    return per;
  });
  return p;
}
