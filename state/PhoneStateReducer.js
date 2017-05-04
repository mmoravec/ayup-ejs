import _ from 'lodash';
import ActionTypes from './ActionTypes';
import { PhoneState } from './Records';

class PhoneStateReducer {
  static reduce(state = new PhoneState(), action) {
    if (PhoneStateReducer[action.type]) {
      return PhoneStateReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.FILTERS_LOADED](state, action) {
    return state.set('filtersLoaded', true);
  }

  static [ActionTypes.USER_LOADED](state, action) {
    return state.set('userLoaded', true);
  }

  static [ActionTypes.FONT_LOADED](state, action) {
    return state.set('fontLoaded', true);
  }

  static [ActionTypes.IMAGES_LOADED](state, action) {
    return state.set('imagesLoaded', true);
  }

  static [ActionTypes.ALERT_SAVING](state, action) {
    return state.set('status', 'saving');
  }

  static [ActionTypes.ALERT_SUCCESS](state, action) {
    return state.set('status', 'success');
  }

  static [ActionTypes.ALERT_ERROR](state, action) {
    return state.set('status', 'error');
  }

  static [ActionTypes.RESET_ALERT](state, action) {
    return state.set('status', '');
  }

  static [ActionTypes.SET_LOCATION](state, action) {
    return state.set('location', action.location);
  }

  static [ActionTypes.OPTLY_LOADED](state, action) {
    return state.set('optly', action.optly);
  }

  static [ActionTypes.SET_OPTLY_VARIATION](state, action) {
    return state.set('optlyVariation', action.variation);
  }

}

export default PhoneStateReducer.reduce;
