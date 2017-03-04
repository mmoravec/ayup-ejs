import ActionTypes from './ActionTypes';
import { Startup } from './Records';

class StartupReducer {
  static reduce(state = new Startup(), action) {
    if (StartupReducer[action.type]) {
      return StartupReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.FILTERS_LOADED](state, action) {
    return state.set('filtersLoaded', true);
  }

  static [ActionTypes.REGION_LOADED](state, action) {
    return state.set('regionLoaded', true);
  }

  static [ActionTypes.USER_LOADED](state, action) {
    return state.set('userLoaded', true);
  }

  static [ActionTypes.FONT_LOADED](state, action) {
    return state.set('fontLoaded', true);
  }

  static [ActionTypes.IMAGES_LOADED](state, action) {
    return state.set('imagesLoaded', true);
  }

}

export default StartupReducer.reduce;
