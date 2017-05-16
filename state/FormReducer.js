import _ from 'lodash';
import { Record, Map } from 'immutable';
import ActionTypes from './ActionTypes';
import { FormState } from './Records';

class FormReducer {
  static reduce(state = new FormState(), action) {
    if (FormReducer[action.type]) {
      return FormReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SHOWHIDE_FIELD](state, action) {
    let newState = {...state[action.field]};
    newState.shown = !newState.shown;
    return state.set(action.field, newState);
  }

  static [ActionTypes.FOCUS_FIELD](state, action) {
    let n = {};
    state.map((val, key) => {
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

  static [ActionTypes.BLUR_FIELDS](state, action) {
    let n = {};
    state.map((val, key) => {
        val.focus = false;
        n[key] = val;
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
    let val = {...state[action.key]};
    val.value = action.value;
    return state.set(action.key, val);
  }

  static [ActionTypes.SET_GEOCODE_ADDRESS](state, action) {
    console.log(state);
    let location = {...state[action.stateKey]};
    location.value = action.data.name;
    location.lnglat = [action.data.long, action.data.lat];
    return state.set(action.stateKey, location);
  }

}

export default FormReducer.reduce;
