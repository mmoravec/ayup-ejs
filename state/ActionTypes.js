export default defineActionConstants([
  'ADD_ACTIVITY',
  'FILTERS_LOADED',
  'FONT_LOADED',
  'GET_FRIENDS',
  'IMAGES_LOADED',
  'REGION_CHANGE',
  'ROUTE_CHANGE',
  'REGION_LOADED',
  'REMOVE_ACTIVITY',
  'REQUEST_ENDED',
  'REQUEST_ERROR',
  'REQUEST_STARTED',
  'REQUEST_SUCCESS',
  'REQUEST_UNAUTHENTICATED',
  'SAVE_EVENT',
  'SAVE_COMMENT',
  'SET_CURRENT_USER',
  'SET_FILTERS',
  'SET_FILTER',
  'SET_FRIENDS',
  'SET_NEARBY',
  'SET_REGION',
  'SET_SELECTED_EVENT',
  'SIGN_IN',
  'SIGN_OUT',
  'USER_LOADED',
]);

function defineActionConstants(names) {
  return names.reduce((result, name) => {
    result[name] = name;
    return result;
  }, {});
}
