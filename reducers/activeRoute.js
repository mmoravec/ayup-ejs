import { Actions } from 'react-native-router-flux';
// import {
//   ADD_VACCINATION_SUCCESS,
// } from '../constants/actions';

export default (state = 'list', action) => {
  switch (action.type) {
    // case SWITCH_TO_CHOOSE_VACCINE_ROUTE:
    //   setTimeout(() => Actions.chooseVaccine(), 0);
    //   return 'add';
    default:
      return state;
  }
};
