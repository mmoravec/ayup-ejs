import ActionTypes from "./ActionTypes";

export default class Actions {
  static blurFields() {
    return {
      type: ActionTypes.BLUR_FIELDS,
    };
  }

  static setCurrentUser(user) {
    return {
      type: ActionTypes.SET_CURRENT_USER,
      user,
    };
  }

  static receivedNotification(notification) {
    return {
      type: ActionTypes.NOTIFICATION_RECEIVED,
      notification,
    };
  }

  static deleteEvent(eventID) {
    return {
      type: ActionTypes.DELETE_EVENT,
      eventID,
    };
  }

  static modifyEvent(eventID) {
    return {
      type: ActionTypes.MODIFY_EVENT,
      eventID,
    };
  }

  static getProfile() {
    return {
      type: ActionTypes.GET_PROFILE,
    };
  }

  static logOut() {
    return {
      type: ActionTypes.REQUEST_UNAUTHENTICATED,
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

  static grantLocation() {
    return {
      type: ActionTypes.GRANT_LOCATION,
    };
  }

  static inviteFriends() {
    return {
      type: ActionTypes.INVITE_FRIENDS,
    };
  }

  static setFormTitle(value) {
    return {
      type: ActionTypes.SET_FORMVALUE,
      key: "title",
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

  static acceptRequest(eventID, userID) {
    return {
      type: ActionTypes.ACCEPT_REQUEST,
      eventID,
      userID,
    };
  }

  static inviteUser(eventID, userID) {
    return {
      type: ActionTypes.INVITE_USER,
      eventID,
      userID,
    };
  }

  static rejectRequest(eventID, userID) {
    return {
      type: ActionTypes.REJECT_REQUEST,
      eventID,
      userID,
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

  static zeroForm() {
    return {
      type: ActionTypes.ZERO_FORM,
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

  static geoCode(lat, long, stateKey) {
    return {
      type: ActionTypes.GEOCODE,
      lat,
      long,
      stateKey,
    };
  }

  static setFormLocation(key, name, long, lat) {
    return {
      type: ActionTypes.SET_GEOCODE_ADDRESS,
      stateKey: key,
      data: {
        name,
        long,
        lat,
      },
    };
  }

  static setFilter(filterStart, filterEnd) {
    return {
      type: ActionTypes.SET_FILTER,
      filterStart,
      filterEnd,
    };
  }
  static saveEvent(event) {
    return {
      type: ActionTypes.SAVE_EVENT,
      event,
    };
  }

  static updateEvent(event, eventID) {
    return {
      type: ActionTypes.UPDATE_EVENT,
      event,
      eventID,
    };
  }
}
