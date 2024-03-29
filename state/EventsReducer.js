import ActionTypes from "./ActionTypes";
import { EventState } from "./Records";
import { merge, List } from "immutable";

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
    return state.set("nearbyEvents", newData);
  }

  static [ActionTypes.SET_ALLEVENTS](state, action) {
    let newData = new List(action.data);
    return state.set("allEvents", newData);
  }

  static [ActionTypes.SET_UNFILTERED_EVENTS](state, action) {
    let newData = new List(action.data);
    return state.set("unfilteredEvents", newData);
  }

  static [ActionTypes.SET_VENUES](state, action) {
    let newData = new List(action.data);
    return state.set("nearbyVenues", newData);
  }

  static [ActionTypes.SET_FILTERS](state, action) {
    return state.set("filters", action.filterList);
  }

  static [ActionTypes.SET_COMMENTS](state, action) {
    return state.set("selectedComments", action.comments);
  }

  static [ActionTypes.SET_FILTER](state, action) {
    return state.set("filter", {
      startTime: action.filterStart,
      endTime: action.filterEnd,
    });
  }

  static [ActionTypes.ADD_ACTIVITY](state, action) {
    return state.set("filters", state.filters.push(action.id));
  }

  static [ActionTypes.REMOVE_ACTIVITY](state, action) {
    let index = state.filters.indexOf(action.id);
    return state.set("filters", state.filters.delete(index));
  }

  static [ActionTypes.SET_SELECTED_EVENT](state, action) {
    return state.set("selectedEvent", action.selectedEvent);
  }

  static [ActionTypes.ZERO_SELECTED_EVENT](state, action) {
    return state.set("selectedEvent", null);
  }

  static [ActionTypes.ZERO_SELECTED_COMMENT](state, action) {
    return state.set("selectedComments", new List());
  }

  static [ActionTypes.REGION_CHANGE](state, action) {
    let region = {
      latitude: action.latitude,
      longitude: action.longitude,
      latitudeDelta: action.latitudeDelta ? action.latitudeDelta : 0.0249666,
      longitudeDelta: action.longitudeDelta ? action.longitudeDelta : 0.017766,
    };
    return state.set("region", region);
  }
  static [ActionTypes.UPDATE_REGION](state, action) {
    let region = {
      latitude: action.latitude,
      longitude: action.longitude,
      latitudeDelta: action.latitudeDelta ? action.latitudeDelta : 0.0249666,
      longitudeDelta: action.longitudeDelta ? action.longitudeDelta : 0.017766,
    };
    return state.set("updateRegion", region);
  }
}

export default EventsReducer.reduce;
