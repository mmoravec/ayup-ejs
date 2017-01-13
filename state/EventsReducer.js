import ActionTypes from './ActionTypes';
import { EventState } from './Records';

class EventsReducer {
  static reduce(state = new EventState(), action) {
    if (EventsReducer[action.type]) {
      return EventsReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_NEARBY](state, action) {
    console.log(action);
    return state.set('event', 'meow');
  }
}

export default EventsReducer.reduce;
