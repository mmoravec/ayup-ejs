export default defineActionConstants([
  'ADD_ACTIVITY',
  'FILTERS_LOADED',
  'FONT_LOADED',
  'REGION_CHANGE',
  'ROUTE_CHANGE',
  'REGION_LOADED',
  'REMOVE_ACTIVITY',
  'SET_CURRENT_USER',
  'SET_FILTERS',
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
