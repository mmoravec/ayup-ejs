import ActionTypes from './ActionTypes';
import { EventState } from './Records';
import { merge, List } from 'immutable';

class EventsReducer {
  static reduce(state = new EventState(), action) {
    if (EventsReducer[action.type]) {
      return EventsReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_NEARBY](state, action) {
    let newData = new List(action.data);
    return state.set('nearbyEvents', newData);
  }

  static [ActionTypes.SET_FILTERS](state, action) {
    return state.set('filters', action.filterList);
  }

  static [ActionTypes.SET_COMMENTS](state, action) {
    return state.set('selectedComments', action.comments);
  }

  static [ActionTypes.SET_FILTER](state, action) {
    return state.set('filter', {startTime: action.filterStart, endTime: action.filterEnd});
  }

  static [ActionTypes.ADD_ACTIVITY](state, action) {
    return state.set('filters', state.filters.push(action.id));
  }

  static [ActionTypes.REMOVE_ACTIVITY](state, action) {
    let index = state.filters.indexOf(action.id);
    return state.set('filters', state.filters.delete(index));
  }

  static [ActionTypes.SET_SELECTED_EVENT](state, action) {
    return state.set('selectedEvent', action.selectedEvent);
  }

  static [ActionTypes.ZERO_SELECTED_EVENT](state, action) {
    return state.set('selectedEvent', null);
  }

  static [ActionTypes.REGION_CHANGE](state, action) {
    let region = {
      latitude: action.latitude,
      longitude: action.longitude,
      latitudeDelta: 0.0249666,
      longitudeDelta: 0.017766,
    };
    return state.set('region', region);
  }

}

export default EventsReducer.reduce;
