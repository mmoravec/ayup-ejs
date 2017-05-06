import _ from 'lodash';
import { Record, Map } from 'immutable';
import ActionTypes from './ActionTypes';
import { FormState } from './Records';

class FormReducer {
  static reduce(state = new FormState(), action) {
    if (FormReducer[action.type]) {
      console.log('modifying state');
      return FormReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SHOWHIDE_FIELD](state, action) {
    console.log(action);
    let newState = {...state[action.field]};
    newState.shown = !newState.shown;
    return state.set(action.field, newState);
  }

  static [ActionTypes.FOCUS_FIELD](state, action) {
    let n = {};
    state.map((val, key) => {
      console.log(val);
      if (val.stateKey === action.el && !val.focus) {
        val.focus = !val.focus;
        n[key] = val;
      } else {
        val.focus = false;
        n[key] = val;
      }
    });
    return state.merge(Map(n));
  }

  static [ActionTypes.SET_FORMVALUE](state, action) {
    // if (key === 'startDate' && this.state.endDate < value) {
    //   this.setState({endDate: value});
    // }
    // if (key === 'endDate' && value < this.state.startDate) {
    //   value = this.state.startDate;
    // }
    // let obj = {};
    // obj[key] = value;
    // this.setState(obj);
    return state.set(action.key, action.value);
  }

}

export default FormReducer.reduce;
