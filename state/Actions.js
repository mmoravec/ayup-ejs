import ActionTypes from './ActionTypes';

export default class Actions {
  static setCurrentUser(user) {
    return {
      type: ActionTypes.SET_CURRENT_USER,
      user,
    };
  }

  static getFriends(user) {
    return {
      type: ActionTypes.GET_FRIENDS,
      user,
    };
  }

  static signIn(user) {
    return {
      type: ActionTypes.SIGN_IN,
      user,
    };
  }

  static regionChange(longitude, latitude, longitudeDelta, latitudeDelta) {
    return {
      type: ActionTypes.REGION_CHANGE,
      longitude,
      latitude,
      longitudeDelta,
      latitudeDelta,
    };
  }

  static routeChange(newRoute, eventId) {
    return {
      type: ActionTypes.ROUTE_CHANGE,
      newRoute,
    };
  }

  static addActivity(id) {
    return {
      type: ActionTypes.ADD_ACTIVITY,
      id,
    };
  }

  static removeActivity(id) {
    return {
      type: ActionTypes.REMOVE_ACTIVITY,
      id,
    };
  }

  static selectEvent(selectedEvent) {
    return {
      type: ActionTypes.SET_SELECTED_EVENT,
      selectedEvent,
    };
  }

  static setFilter(filterStart, filterEnd) {
    return   {
        type: ActionTypes.SET_FILTER,
        filterStart,
        filterEnd,
      };
  }
  static saveEvent(event) {
    return   {
        type: ActionTypes.SAVE_EVENT,
        event,
      };
  }
}
