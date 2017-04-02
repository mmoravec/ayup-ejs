import ActionTypes from './ActionTypes';
import { User } from './Records';
import LocalStorage from '../utils/LocalStorage';

class EventsReducer {
  static reduce(state = new User(), action) {
    if (EventsReducer[action.type]) {
      return EventsReducer[action.type](state, action);
    } else {
      return state;
    }
  }
  static [ActionTypes.SET_CURRENT_USER](state, action) {
    return action.user;
  }
  static [ActionTypes.SET_FRIENDS](state, action) {
    return state.set('friends', action.friends);
  }
  static [ActionTypes.LOG_OUT](state, action) {
    LocalStorage.clearAllAsync();
    return state.set('secret', null);
  }
}

export default EventsReducer.reduce;
