import ActionTypes from "./ActionTypes";
import { Credential } from "./Records";
import { merge, List } from "immutable";

class CredentialReducer {
  static reduce(state = new Credential(), action) {
    if (CredentialReducer[action.type]) {
      return CredentialReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_CREDENTIAL](state, action) {
    return new Credential({ ...action.credential });
  }
}

export default CredentialReducer.reduce;
