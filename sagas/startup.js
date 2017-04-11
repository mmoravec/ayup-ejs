import {
    put,
    call,
    take,
    select,
} from 'redux-saga/effects';
import {
    List,
} from 'immutable';
import {
  Image,
} from 'react-native';
import { Font, Asset, Constants, Location, Permissions } from 'expo';
import _ from 'lodash';
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
        call(setInitialRegion),
        call(getUser),
        call(loadFilters),
        call(loadFonts),
        call(loadImages),
    ];
    let user = result[1];
    if (user.new) {
        yield take(ActionTypes.ROUTE_CHANGE);
        yield call(getLocation);
    } else {
      yield call(getLocation);
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

function* getLocation() {
  let permission = yield call(Permissions.askAsync, Permissions.LOCATION);
  if (permission.status !== 'granted') {
    yield put({ type: ActionTypes.SET_LOCATION, location: 'denied'});
  } else {
    let location = yield call(Location.getCurrentPositionAsync, {});
    yield put({ type: ActionTypes.SET_LOCATION, location});
    yield put({
      type: ActionTypes.REGION_CHANGE,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }
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

function* setInitialRegion() {
    yield put({
        type: ActionTypes.REGION_CHANGE,
        latitude: 37.78825,
        longitude: -122.4324,
    });
    yield put({
        type: ActionTypes.REGION_LOADED,
    });
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
