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
    return state.set('nearbyEvents', action.data);
  }

  static [ActionTypes.SET_FILTERS](state, action) {
    return state.set('filters', action.filterList);
  }

  static [ActionTypes.SET_ICONS](state, action) {
    console.log(action);
    return state.set('icons', action.iconMap);
  }

  static [ActionTypes.SET_REGION](state, action) {
    let region = {
      latitude: action.region.latitude,
      longitude: action.region.longitude,
      latitudeDelta: action.region.latitudeDelta ? action.region.latitudeDelta : 0.0922,
      longitudeDelta: action.region.longitudeDelta ? action.region.longitudeDelta : 0.0421,
    };
    return state.set('region', region);
  }

}

export default EventsReducer.reduce;
