export default defineActionConstants([
  'ALERT_SAVING',
  'ALERT_SUCCESS',
  'ALERT_ERROR',
  'ADD_ACTIVITY',
  'FILTERS_LOADED',
  'FONT_LOADED',
  'GET_FRIENDS',
  'GET_PROFILE',
  'IMAGES_LOADED',
  'LOG_OUT',
  'REGION_CHANGE',
  'ROUTE_CHANGE',
  'REGION_LOADED',
  'REMOVE_ACTIVITY',
  'REQUEST_ENDED',
  'REQUEST_ERROR',
  'REQUEST_STARTED',
  'REQUEST_SUCCESS',
  'REQUEST_UNAUTHENTICATED',
  'RESET_ALERT',
  'SAVE_EVENT',
  'SAVE_COMMENT',
  'SET_CURRENT_USER',
  'SET_FILTERS',
  'SET_FILTER',
  'SET_FRIENDS',
  'SET_LOCATION',
  'SET_NEARBY',
  'SET_REGION',
  'SET_SELECTED_EVENT',
  'SIGN_IN',
  'SIGN_OUT',
  'SYNC_PROFILE',
  'UPDATE_PROFILE',
  'USER_LOADED',
]);

function defineActionConstants(names) {
  return names.reduce((result, name) => {
    result[name] = name;
    return result;
  }, {});
}
