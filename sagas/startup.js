import _ from 'lodash';
import {
    put,
    call,
    take,
    race,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
    List,
} from 'immutable';
import {
  Image,
} from 'react-native';
import { Font, Asset, Location, Permissions, Contacts } from 'expo';
import ActionTypes from '../state/ActionTypes';
import LocalStorage from '../utils/LocalStorage';
import { request } from '../utils/fetch';
import {
    User,
    Filter,
} from '../state/Records';
import activities from '../constants/activities';

//TODO: Add caching scheme for fonts and images from crash example
export default function* startup() {
  let result = yield [
    call(getUser),
    call(getPhoneState),
  ];
  yield [
      call(loadFilters),
      call(loadFonts),
      call(loadImages),
  ];
  let phone = result[1];
  //change this to user.locationGranted when implemented
  if (phone.locationGranted) {
    console.log('called getlocation');
    yield call(getLocation);
  }
  if (phone.contactsGranted) {
    yield call(getContacts);
  }
}

function* loadImages() {
  yield call(exLoadImages);
  yield put({
      type: ActionTypes.IMAGES_LOADED,
  });
}


function* loadFonts() {
  yield call(getFonts);
  yield put({
      type: ActionTypes.FONT_LOADED,
  });
}

function* loadFilters() {
    let filterList = new List(_.keys(activities));
    yield put({
        type: ActionTypes.SET_FILTERS,
        filterList,
    });
    yield put({
        type: ActionTypes.FILTERS_LOADED,
    });
}

export function* getLocation() {
  let permission = yield call(Permissions.askAsync, Permissions.LOCATION);
  if (permission.status !== 'granted') {
    yield put({ type: ActionTypes.LOCATION_DENIED, location: 'denied'});
    yield put({
        type: ActionTypes.REGION_LOADED,
    });
    return false;
  } else {
    let {location, timeout } = yield race({
      location: call(Location.getCurrentPositionAsync, {}),
      timeout: call(delay, 2000),
    });
    // console.log('getting  location');
    // let location = yield call(Location.getCurrentPositionAsync, {});
    // console.log('location success');
    // console.log('not working');
    if (timeout) {
      location = {
        coords: {
          latitude: 37.785834,
          longitude: -122.406417,
        },
      };
    }
    yield put({
      type: ActionTypes.REGION_CHANGE,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    return true;
  }
}

export function* getContacts() {
  const p = yield call(Permissions.askAsync, Permissions.CONTACTS);
  if (p.status !== 'granted') {
    //alert user to give us contacts
    return;
  }
  let contacts = yield call(Contacts.getContactsAsync, { fields: [Contacts.PHONE_NUMBERS], pageSize: 2000 });
  yield put({type: ActionTypes.SET_CONTACTS, contacts });
  return true;
}

function* getPhoneState() {
  let phone = yield call(LocalStorage.getPhoneStateAsync);
  let merge = {};
  if (phone !== null) {
    merge.locationGranted = phone.locationGranted;
    merge.contactsGranted = phone.contactsGranted;
    merge.notificationGranted = phone.notificationGranted;
  }
  yield put({
      type: ActionTypes.MERGE_PHONESTATE, phone: merge,
  });
  return merge;
}

function* getUser() {
    let user = yield call(LocalStorage.getUserAsync);
    if (user === null || !user.fbid || !user.id) {
        user = {
            'new': true,
        };
    } else {
      user.hosted = new List(user.hosted);
      user.invited = new List(user.invited);
      user.joined = new List(user.joined);
      user.rejected = new List(user.rejected);
      user.requested = new List(user.requested);
      user.completed = new List(user.completed);
      user.events = new List(user.events);
      user.badges = new List(user.badges);
      user.activities = new List(user.activities);
      user.friends = new List(user.friends);
      user.new = false;
    }
    user = new User(user);
    yield put({
        type: ActionTypes.SET_CURRENT_USER,
        user,
    });
    yield put({
        type: ActionTypes.USER_LOADED,
    });
    if (!user.new) {
      yield put({ type: ActionTypes.SYNC_PROFILE });
    }
    return user;
}

async function getFonts() {
  return Font.loadAsync({ 'LatoRegular': require('../assets/fonts/Lato-Regular.ttf')});
}

async function exLoadImages() {
  const images = cacheImages([
      require('../assets/images/btn_main.png'),
      require('../assets/images/btn_close.png'),
      require('../assets/images/btn_list.png'),
      require('../assets/images/menu/btn_activities.png'),
      require('../assets/images/menu/btn_events.png'),
      require('../assets/images/menu/btn_new_event.png'),
      require('../assets/images/menu/btn_profile.png'),
      require('../assets/images/menu/btn_settings.png'),
      require('../assets/images/btn_menu_close.png'),
    ]);
  return await Promise.all([...images]);
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
