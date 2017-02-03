import ActionTypes from './ActionTypes';

export default class Actions {
  static setCurrentUser(user) {
    return {
      type: ActionTypes.SET_CURRENT_USER,
      user,
    }
  }

  static signIn(user) {
    return {
      type: ActionTypes.SIGN_IN,
      user,
    }
  }

  static regionChange(longitude, latitude) {
    return {
      type: ActionTypes.REGION_CHANGE,
      longitude,
      latitude,
    }
  }
}
