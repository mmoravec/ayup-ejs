import _ from "lodash";
import { put, call, take, race, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import { List } from "immutable";
import { Image, Alert, Linking } from "react-native";
import qs from "qs";
import {
  Font,
  Asset,
  Location,
  Permissions,
  Contacts,
  Constants,
  Notifications,
} from "expo";
import { URL, POST } from "../constants/rest";
import ActionTypes from "../state/ActionTypes";
import LocalStorage from "../utils/LocalStorage";
import { request } from "../utils/fetch";
import { PhoneState, Filter } from "../state/Records";
import activities from "../constants/activities";

//TODO: Add caching scheme for fonts and images from crash example
export default function* startup() {
  yield [call(loadFilters), call(loadFonts), call(loadImages)];
  let result = yield [call(getPhoneState), call(getCredential)];
  let phone = result[0], cred = result[1];
  yield call(getParams);
  yield put({ type: ActionTypes.PHONESTATE_LOADED });
  //change this to user.locationGranted when implemented
  if (cred && cred.secret !== null) {
    yield call(checkCredential, cred);
    yield put({ type: ActionTypes.GET_PROFILE });
  }
  if (phone.locationGranted) {
    yield call(getLocation);
  }
  if (phone.contactsGranted) {
    yield call(getContacts);
  }
  if (phone.notificationsGranted) {
    yield put({ type: ActionTypes.SUBSCRIBE_NOTIFICATIONS });
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
  if (!filters || !filters.basketball) {
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
      timeout: call(delay, 5000),
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
  yield put({
    type: ActionTypes.CONTACTS_RECEIVED,
    contacts,
  });
  return true;
}

function* getParams() {
  let url = yield call(Linking.getInitialURL);
  if (Constants.intentUri) {
    let queryString = Constants.intentUri.substr(
      Constants.intentUri.indexOf("?") + 1
    );
    if (queryString) {
      let data = qs.parse(queryString);
      yield put({ type: ActionTypes.SET_PARAMS, data });
    }
  } else if (url) {
    let queryString = url.substr(url.indexOf("?") + 1);
    if (queryString) {
      let data = qs.parse(queryString);
      yield put({ type: ActionTypes.SET_PARAMS, data });
    }
  }
}

function* getPhoneState() {
  let phone = yield call(LocalStorage.getPhoneStateAsync);
  if (phone !== null) {
    phone.status = ActionTypes.INACTIVE;
    phone.notification = {
      origin: "meow",
      data: "I really love beans",
    };
    yield put({
      type: ActionTypes.SET_PHONESTATE,
      phone,
    });
  } else {
    phone = yield select(state => state.phone);
  }
  return phone;
}

function* getCredential() {
  let cred = yield call(LocalStorage.getCredentialAsync);
  if (cred != null) {
    yield put({ type: ActionTypes.SET_CREDENTIAL, credential: cred });
  } else {
    cred = yield select(state => state.credential);
  }
  yield put({ type: ActionTypes.CREDENTIAL_LOADED });
  return cred;
}

function* checkCredential(cred) {
  //TODO: check credential expiration and set to expire if it is dead
  const params = yield select(state => state.phone.params);
  if (cred.secret) {
    yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Home" });
    if (params.userid && params.eventid) {
      try {
        // console.log(fbInfo);
        yield call(
          request,
          POST,
          URL +
            "/v1.0/events/" +
            params.eventid +
            "/accepttextinvite?userid=" +
            params.userid
        );
      } catch (error) {
        //Alert Error
        yield put({ type: ActionTypes.ALERT_ERROR, error });
        return;
      }
    }
  }
}

function* getFonts() {
  yield call(Font.loadAsync, {
    LatoRegular: require("../assets/fonts/Lato-Regular.ttf"),
  });
}

async function exLoadImages() {
  const images = cacheImages([
    require("../assets/images/bkgd_map.png"),
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
