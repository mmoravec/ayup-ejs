import _ from "lodash";
import { put, call, take, race } from "redux-saga/effects";
import { delay } from "redux-saga";
import { List } from "immutable";
import { Image } from "react-native";
import {
  Font,
  Asset,
  Location,
  Permissions,
  Contacts,
  Notifications,
} from "expo";
import ActionTypes from "../state/ActionTypes";
import LocalStorage from "../utils/LocalStorage";
import { request } from "../utils/fetch";
import { User, Filter } from "../state/Records";
import activities from "../constants/activities";

//TODO: Add caching scheme for fonts and images from crash example
export default function* startup() {
  let result = yield [call(getPhoneState), call(getCredential)];
  yield [call(loadFilters), call(loadFonts), call(loadImages)];
  let phone = result[0], cred = result[1];
  //change this to user.locationGranted when implemented
  if (cred !== null) {
    yield call(checkCredential, cred);
  }
  if (phone.locationGranted) {
    console.log("called getlocation");
    yield call(getLocation);
  }
  if (phone.contactsGranted) {
    yield call(getContacts);
  }
  if (phone.notificationsGranted) {
    yield call(subscribeNotifications);
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
  let filters = yield call(LocalStorage.getFiltersAsync);
  if (!filters) {
    let filterList = new List(_.keys(activities));
    yield put({
      type: ActionTypes.SET_FILTERS,
      filterList,
    });
  } else {
    yield put({ type: ActionTypes.SET_FILTERS, filterList: new List(filters) });
  }
  yield put({
    type: ActionTypes.FILTERS_LOADED,
  });
}

export function* getLocation() {
  let permission = yield call(Permissions.askAsync, Permissions.LOCATION);
  if (permission.status !== "granted") {
    yield put({ type: ActionTypes.LOCATION_DENIED, location: "denied" });
    yield put({
      type: ActionTypes.REGION_LOADED,
    });
    return false;
  } else {
    let { location, timeout } = yield race({
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
  if (p.status !== "granted") {
    //alert user to give us contacts
    return;
  }
  let contacts = yield call(Contacts.getContactsAsync, {
    fields: [Contacts.PHONE_NUMBERS],
    pageSize: 2000,
  });
  yield put({ type: ActionTypes.SET_CONTACTS, contacts: contacts.data });
  return true;
}

function* getPhoneState() {
  let phone = yield call(LocalStorage.getPhoneStateAsync);
  let merge = {};
  if (phone !== null) {
    merge.locationGranted = phone.locationGranted;
    merge.contactsGranted = phone.contactsGranted;
    merge.notificationsGranted = phone.notificationsGranted;
  }
  yield put({
    type: ActionTypes.MERGE_PHONESTATE,
    phone: merge,
  });
  return merge;
}

function* getCredential() {
  let cred = yield call(LocalStorage.getCredentialAsync);
  if (cred != null) {
    yield put({ type: ActionTypes.SET_CREDENTIAL, credential: cred });
  }
  yield put({ type: ActionTypes.CREDENTIAL_LOADED });
  return cred;
}

function* checkCredential(cred) {
  //TODO: check credential expiration and set to expire if it is dead
  if (cred.secret) {
    yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Home" });
  }
}

function* subscribeNotifications() {
  console.log("subscribe note called");
  yield call(Notifications.addListener, _handleNotification);
}

function* _handleNotification(notification) {
  console.log("handle notification");
  yield put({ type: ActionTypes.NOTIFICATION_RECEIVED, notification });
}

async function getFonts() {
  return Font.loadAsync({
    LatoRegular: require("../assets/fonts/Lato-Regular.ttf"),
  });
}

async function exLoadImages() {
  const images = cacheImages([
    require("../assets/images/btn_main.png"),
    require("../assets/images/btn_close.png"),
    require("../assets/images/btn_list.png"),
    require("../assets/images/menu/btn_activities.png"),
    require("../assets/images/menu/btn_events.png"),
    require("../assets/images/menu/btn_new_event.png"),
    require("../assets/images/menu/btn_profile.png"),
    require("../assets/images/menu/btn_settings.png"),
    require("../assets/images/btn_menu_close.png"),
  ]);
  return await Promise.all([...images]);
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
