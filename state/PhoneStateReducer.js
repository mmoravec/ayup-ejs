import _ from "lodash";
import { Map } from "immutable";
import ActionTypes from "./ActionTypes";
import { PhoneState } from "./Records";

class PhoneStateReducer {
  static reduce(state = new PhoneState(), action) {
    if (PhoneStateReducer[action.type]) {
      return PhoneStateReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.FILTERS_LOADED](state, action) {
    return state.set("filtersLoaded", true);
  }

  static [ActionTypes.MERGE_PHONESTATE](state, action) {
    return state.merge(Map(action.phone));
  }

  static [ActionTypes.FONT_LOADED](state, action) {
    return state.set("fontLoaded", true);
  }

  static [ActionTypes.LOCATION_GRANTED](state, action) {
    return state.set("locationGranted", true);
  }

  static [ActionTypes.CONTACTS_GRANTED](state, action) {
    return state.set("contactsGranted", true);
  }

  static [ActionTypes.NOTIFICATIONS_GRANTED](state, action) {
    return state.set("notificationsGranted", true);
  }

  static [ActionTypes.IMAGES_LOADED](state, action) {
    return state.set("imagesLoaded", true);
  }

  static [ActionTypes.CREDENTIAL_LOADED](state, action) {
    return state.set("credLoaded", true);
  }

  static [ActionTypes.SET_FBFRIENDS](state, action) {
    return state.set("fbFriends", action.friends);
  }

  static [ActionTypes.ALERT_SAVING](state, action) {
    return state.set("status", "saving");
  }

  static [ActionTypes.ALERT_SUCCESS](state, action) {
    return state.set("status", "success");
  }

  static [ActionTypes.ALERT_ERROR](state, action) {
    return state.set("status", "error");
  }

  static [ActionTypes.RESET_ALERT](state, action) {
    return state.set("status", "");
  }

  static [ActionTypes.OPTLY_LOADED](state, action) {
    return state.set("optly", action.optly);
  }

  static [ActionTypes.SET_OPTLY_VARIATION](state, action) {
    return state.set("optlyVariation", action.variation);
  }
}

export default PhoneStateReducer.reduce;
