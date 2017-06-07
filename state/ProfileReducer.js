import ActionTypes from "./ActionTypes";
import { Profile } from "./Records";
import { merge, List } from "immutable";

class ProfileReducer {
  static reduce(state = new Profile(), action) {
    if (ProfileReducer[action.type]) {
      return ProfileReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_PROFILE](state, action) {
    return new Profile(...action.profile);
  }
}

export default ProfileReducer.reduce;
