import { NavigationActions } from 'react-navigation';
import { takeLatest } from 'redux-saga/effects';
import ActionTypes from '../state/ActionTypes';
import Store from '../state/Store';

//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchRouteChange() {
  yield takeLatest(ActionTypes.ROUTE_CHANGE, changeRoute);
}

export function* watchUnauthenticated() {
  yield takeLatest(ActionTypes.REQUEST_UNAUTHENTICATED, goToLogin);
}

function* changeRoute(action) {
  if (action.newRoute === "Back") {
    Store.dispatch(NavigationActions.back());
  } else {
    Store.dispatch(NavigationActions.navigate({ routeName: action.newRoute }));
  }
}

function* goToLogin() {
  Store.dispatch(NavigationActions.navigate({ routeName: "Login" }));
}
