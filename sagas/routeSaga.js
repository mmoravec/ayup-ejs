import { NavigationActions } from "react-navigation";
import { takeLatest, select, put } from "redux-saga/effects";
import ActionTypes from "../state/ActionTypes";
import Store from "../state/Store";
import LocalStorage from "../utils/LocalStorage";

//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchRouteChange() {
  yield takeLatest(ActionTypes.ROUTE_CHANGE, changeRoute);
}

export function* watchUnauthenticated() {
  yield takeLatest(ActionTypes.REQUEST_UNAUTHENTICATED, goToLogin);
}

function* changeRoute(action) {
  const nav = yield select(state => state.navigation);
  if (
    nav.routes[nav.index].routeName === "Login" && action.newRoute === "Back"
  ) {
    return;
  }
  if (action.newRoute === "Back") {
    Store.dispatch(NavigationActions.back());
  } else {
    Store.dispatch(NavigationActions.navigate({ routeName: action.newRoute }));
    yield put({ type: ActionTypes.ROUTE_CHANGED });
  }
}

function* goToLogin() {
  const nav = yield select(state => state.navigation);
  LocalStorage.clearCredentials();
  if (nav.routes[nav.index].routeName !== "Login") {
    Store.dispatch(NavigationActions.navigate({ routeName: "Login" }));
  }
}
