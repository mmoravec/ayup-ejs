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

  static deleteEvent(eventID) {
    return {
      type: ActionTypes.DELETE_EVENT,
      eventID,
    };
  }

  static syncProfile() {
    return {
      type: ActionTypes.SYNC_PROFILE,
    };
  }

  static logOut() {
    return {
      type: ActionTypes.LOG_OUT,
    };
  }

  static signIn(user) {
    return {
      type: ActionTypes.SIGN_IN,
      user,
    };
  }

  static showhideField(field) {
    return {
      type: ActionTypes.SHOWHIDE_FIELD,
      field,
    };
  }

  static focusField(field) {
    console.log(field);
    return {
      type: ActionTypes.FOCUS_FIELD,
      el: field,
    };
  }

  static setFormValue(key, value) {
    return {
      type: ActionTypes.SET_FORMVALUE,
      key,
      value,
    };
  }

  static loadComments(eventID) {
    return {
      type: ActionTypes.LOAD_COMMENTS,
      eventID,
    };
  }

  static saveComment(comment, eventID, parentID) {
    return {
      type: ActionTypes.SAVE_COMMENT,
      comment,
      eventID,
      parentID,
    };
  }

  static joinEvent(eventID) {
    return {
      type: ActionTypes.JOIN_EVENT,
      eventID,
    };
  }

  static requestEvent(eventID) {
    return {
      type: ActionTypes.REQUEST_EVENT,
      eventID,
    };
  }

  static acceptEvent(eventID) {
    return {
      type: ActionTypes.ACCEPT_EVENT,
      eventID,
    };
  }

  static rejectEvent(eventID) {
    return {
      type: ActionTypes.REJECT_EVENT,
      eventID,
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
      type: ActionTypes.LOAD_EVENT,
      eventID: selectedEvent,
    };
  }

  static zeroSelectedEvent() {
    return {
      type: ActionTypes.ZERO_SELECTED_EVENT,
    };
  }

  static resetAddress() {
    return {
      type: ActionTypes.RESET_ADDRESS,
    };
  }

  static zeroSelectedComment() {
    return {
      type: ActionTypes.ZERO_SELECTED_COMMENT,
    };
  }

  static geoCode(lat, long) {
    return {
      type: ActionTypes.GEOCODE,
      lat,
      long,
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
