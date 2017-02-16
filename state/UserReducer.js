import ActionTypes from './ActionTypes';
import { User } from './Records';

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
}

export default EventsReducer.reduce;
