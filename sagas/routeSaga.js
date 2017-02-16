import { takeLatest, delay } from 'redux-saga'
import { NavigationActions } from 'react-navigation'
import { put, call, take } from 'redux-saga/effects'
import ActionTypes from '../state/ActionTypes'
import Store from '../state/Store';

//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchRouteChange() {
  yield takeLatest(ActionTypes.ROUTE_CHANGE, changeRoute);
}

function* changeRoute(action) {
  let { newRoute, eventId } = action;
  let navigatorUID = Store.getState();
  const meh = NavigationActions.navigate({ routeName: 'Event'});
  console.log(meh);
  yield put(meh);
  if (eventId !== undefined) {
    //Store.dispatch(NavigationActions.push(navigatorUID, Router.getRoute(newRoute, {eventId})));
  } else {
  //  Store.dispatch(NavigationActions.push(navigatorUID, Router.getRoute(newRoute)));
  }
}
