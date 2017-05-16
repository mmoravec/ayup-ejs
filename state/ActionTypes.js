export default defineActionConstants([
  'ACCEPT_EVENT',
  'ALERT_SAVING',
  'ALERT_SUCCESS',
  'ALERT_ERROR',
  'ADD_ACTIVITY',
  'BLUR_FIELDS',
  'CONTACTS_GRANTED',
  'DELETE_EVENT',
  'FILTERS_LOADED',
  'FOCUS_FIELD',
  'FONT_LOADED',
  'GEOCODE',
  'GET_FRIENDS',
  'GETTING_STARTED',
  'GRANT_LOCATION',
  'IMAGES_LOADED',
  'INVITE_FRIENDS',
  'JOIN_EVENT',
  'LOAD_COMMENTS',
  'LOAD_EVENT',
  'LOCATION_DENIED',
  'LOCATION_GRANTED',
  'LOG_OUT',
  'MERGE_PHONESTATE',
  'NOTIFICATIONS_GRANTED',
  'OPTLY_LOADED',
  'PROFILE_UPDATED',
  'REGION_CHANGE',
  'ROUTE_CHANGE',
  'REJECT_EVENT',
  'REMOVE_ACTIVITY',
  'REQUEST_ENDED',
  'REQUEST_ERROR',
  'REQUEST_EVENT',
  'REQUEST_STARTED',
  'REQUEST_SUCCESS',
  'REQUEST_UNAUTHENTICATED',
  'RESET_ADDRESS',
  'RESET_ALERT',
  'SAVE_EVENT',
  'SAVE_COMMENT',
  'SET_COMMENTS',
  'SET_CONTACTS',
  'SET_CURRENT_USER',
  'SET_GEOCODE_ADDRESS',
  'SET_FILTERS',
  'SET_FILTER',
  'SET_FORMVALUE',
  'SET_FRIENDS',
  'SET_NEARBY',
  'SET_OPTLY_VARIATION',
  'SET_REGION',
  'SET_SELECTED_EVENT',
  'SHOWHIDE_FIELD',
  'SIGN_IN',
  'SIGN_OUT',
  'SYNC_PROFILE',
  'UPDATE_PROFILE',
  'USER_LOADED',
  'ZERO_SELECTED_COMMENT',
  'ZERO_SELECTED_EVENT',
]);

function defineActionConstants(names) {
  return names.reduce((result, name) => {
    result[name] = name;
    return result;
  }, {});
}
