import ActionTypes from "./ActionTypes";
import { Account } from "./Records";
import { merge, List } from "immutable";

class AccountReducer {
  static reduce(state = new Account(), action) {
    if (AccountReducer[action.type]) {
      return AccountReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_Account](state, action) {
    return new Account(...action.account);
  }
}

export default AccountReducer.reduce;
