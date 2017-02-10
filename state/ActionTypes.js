export default defineActionConstants([
  'REGION_CHANGE',
  'ROUTE_CHANGE',
  'SET_CURRENT_USER',
  'SET_FILTERS',
  'SET_NEARBY',
  'SET_REGION',
  'SIGN_IN',
  'SIGN_OUT',
]);

function defineActionConstants(names) {
  return names.reduce((result, name) => {
    result[name] = name;
    return result;
  }, {});
}
